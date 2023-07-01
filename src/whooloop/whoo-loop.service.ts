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
import { WHOOING_WEBHOOK_BASE_URL } from '../lib/constants';

@Injectable()
export class WhooLoopService {
  constructor(
    private readonly trxRepository: TrxRepository,
    private readonly logRepository: LogRepository,
  ) {}

  // 매일 23시 59분 35초에 오늘이 종료일인 거래 OFF 처리
  @Cron('35 59 23 * * *')
  async dailyCronForExpire() {
    const today: string = getToday();
    this.trxRepository.turnOffExpiredTrxs(today);
  }

  @Cron('3 * * * * *') // 매분 3초마다
  async cronByMinute() {
    const dataList: WhooingInputData[] = await this._getDataListByTime();
    // dataList의 entry_date에 오늘 날짜를 넣어줌
    const today = getToday();
    dataList.forEach((data) => {
      data.entry_date = today;
    });

    if (dataList.length > 10) {
      // 한번에 10개 이상의 웹훅 요청할 경우 for반복문으로 좀 더 천천히 요청되도록 함
      for (const data of dataList) {
        this._sendWhooingInput(data);
      }
    } else if (dataList.length > 0) {
      dataList.forEach((data) => {
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
      memo:
        data.memo +
        ' / ' +
        getDateTimeNow() +
        ' - WhooLoop( http://146.56.136.6:5173/ )에서 후잉 webhook을 통해 입력되었습니다.',
    };
    const dataJson = JSON.stringify(whooingInputForm);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: WHOOING_WEBHOOK_BASE_URL + data.webhook_token,
      headers: {
        'Content-Type': 'application/json',
      },
      data: dataJson,
    };

    const logData = new LogEntity();
    logData.request_url = config.url;
    logData.request_body = dataJson;
    logData.transaction_idx = data.transaction_idx;

    axios
      .request(config)
      .then((response) => {
        logData.response_body = response.data;
        this.logRepository.create(logData);
      })
      .catch((error) => {
        logData.response_body = error.data;
        this.logRepository.create(logData);
      });
  }

  private async _getDataListByTime(): Promise<WhooingInputData[]> {
    const date = new Date();
    const dayOfWeekToday = date.getDay();
    const timeNow = getHHmm();
    const weekdays = [1, 2, 3, 4, 5]; // 월화수목금 평일

    // 들어갈 수 있는 값: 요일을 가리키는 숫자, 매일을 뜻하는 d, 평일을 뜻하는 w
    const requestDayOfWeekData = [dayOfWeekToday, 'd'];
    if (weekdays.includes(dayOfWeekToday)) {
      requestDayOfWeekData.push('w');
    }
    const result = await this.trxRepository.findByTime(
      requestDayOfWeekData,
      timeNow,
    );

    const whooingInputDataList: WhooingInputData[] = [];
    result.forEach((data) => {
      const whooingInputData = new WhooingInputData();
      whooingInputData.transaction_idx = data.transaction_idx;
      whooingInputData.webhook_token = data.webhook_token;
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
