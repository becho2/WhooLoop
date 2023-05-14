import { Injectable } from '@nestjs/common';
import { getNow, getToday } from '../lib/helper';
import {
  WhooingInputData,
  WhooingInputForm,
} from './dto/whooing-input-form.dto';
import { TrxRepository } from '../trx/trx.repository';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WhooingEverydayService {
  constructor(private readonly trxRepository: TrxRepository) {}

  // @Cron('*/5 * * * * *') // 매 5초마다
  @Cron('5 * * * * *') // 매분 5초마다
  cronByMinute() {
    const dataList: WhooingInputData[] = this._getDataListByTime();
    if (dataList.length > 0) {
      dataList.forEach((data) => {
        data.input_form.entry_date = getToday();
        data.input_form.memo = getNow() + '에 webhook을 통해 입력되었습니다.';
        // console.log(data);
        this._sendWhooingInput(data.webhook_url, data.input_form);
      });
    }
    // this.sendWhooingInputVerNestJsAxios(url);
  }

  // whooing으로 입력할 값 전송
  private _sendWhooingInput(url: string, data: WhooingInputForm): void {
    const dataJson = JSON.stringify(data);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: dataJson,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //
  private _getDataListByTime(): WhooingInputData[] {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const timeNow = getNow();
    const result = this.trxRepository.findByTime(dayOfWeek, timeNow);

    /**
     * @TODO result를 받아서 WhooingInputData[] 형태로 가공
     * */
    const dataList: WhooingInputData[] = [];
    return dataList;
  }

  TEST_getDataListByTime(): WhooingInputData[] {
    return this._getDataListByTime();
  }
}
