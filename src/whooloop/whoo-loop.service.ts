import { Injectable } from '@nestjs/common';
import { getHHmm, getDateTimeNow, getToday } from '../lib/helper';
import {
  WhooingInputData,
  WhooingInputForm,
} from './dto/whooing-input-form.dto';
import { TrxRepository } from '../trx/trx.repository';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { LogRepository } from './log.repository';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class WhooLoopService {
  constructor(
    private readonly trxRepository: TrxRepository,
    private readonly logRepository: LogRepository,
  ) {}

  @Cron('5 * * * * *') // 매분 5초마다
  async cronByMinute() {
    const dataList: WhooingInputData[] = await this._getDataListByTime();
    if (dataList.length > 0) {
      dataList.forEach((data) => {
        data.entry_date = getToday();
        data.memo =
          data.memo +
          ' / ' +
          getDateTimeNow() +
          ' - WhooLoop에서 후잉 webhook을 통해 입력되었습니다.';
        this._sendWhooingInput(data);
      });
    }
  }

  // whooing으로 입력할 값 전송
  private _sendWhooingInput(data: WhooingInputData): void {
    const whooingInputForm: WhooingInputForm = {
      entry_date: data.entry_date,
      item: data.item,
      money: data.money,
      left: data.left,
      right: data.right,
      memo: data.memo,
    };
    const dataJson = JSON.stringify(whooingInputForm);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: data.webhook_url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: dataJson,
    };

    const logData = new LogEntity();
    logData.request_url = data.webhook_url;
    logData.request_body = dataJson;
    logData.transaction_idx = data.transaction_idx;

    axios
      .request(config)
      .then((response) => {
        logData.response_body = JSON.stringify(response);
        this.logRepository.create(logData);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        logData.response_body = JSON.stringify(error);
        this.logRepository.create(logData);
        console.log(error);
      });
  }

  private async _getDataListByTime(): Promise<WhooingInputData[]> {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const timeNow = getHHmm();
    const result = await this.trxRepository.findByTime(dayOfWeek, timeNow);

    const whooingInputDataList: WhooingInputData[] = [];
    result.forEach((data) => {
      const whooingInputData = new WhooingInputData();
      whooingInputData.transaction_idx = data.transaction_idx;
      whooingInputData.webhook_url = data.webhook_url;
      whooingInputData.item = data.transaction_item;
      whooingInputData.money = data.transaction_money_amount;
      whooingInputData.left = data.transaction_left;
      whooingInputData.right = data.transaction_right;
      whooingInputData.memo = data.transaction_memo;
      whooingInputDataList.push(whooingInputData);
    });
    return whooingInputDataList;
  }

  async TEST_getDataListByTime(): Promise<WhooingInputData[]> {
    return await this._getDataListByTime();
  }
}
