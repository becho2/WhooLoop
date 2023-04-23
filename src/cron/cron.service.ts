import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { WhooingWebhookInputDto } from './dto/whooing-input-form.dto';
import { getHHmm, getNow, getToday } from '../lib/date';

@Injectable()
export class CronService {
  constructor(private readonly trxRepository: TrxRespository) {}
  @Cron('0 */5 * * * *') // 5분마다 실행
  dailyCron() {
    const hoursMinutesNow = getHHmm();
    const trxList = this.trxRespository.getTrxList(hoursMinutesNow);
    trxList.forEach((trx) => {
      trx.entry_date = getToday();
      trx.memo = getNow() + '에 매일의 후잉을 통해 입력되었습니다.';
      this.sendWhooingInput(trx.webhook_url, trx);
    });
  }

  // whooing으로 입력할 값 전송
  sendWhooingInput(url: string, data: WhooingWebhookInputDto): void {
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
}
