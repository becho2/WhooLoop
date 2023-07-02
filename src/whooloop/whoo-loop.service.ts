import { Injectable } from '@nestjs/common';
import { getHHmm, getDateTimeNow, getToday } from '../lib/helper';
import {
  WhooingInputData,
  WhooingInputForm,
} from './dto/whooing-input-form.dto';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { LogRepository } from './log.repository';
import { LogEntity } from './entities/log.entity';
import {
  WHOOING_USER_ID_OF_APP_MASTER,
  WHOOING_WEBHOOK_BASE_URL,
} from '../lib/constants';
import { OauthAccessTokenResponseDto } from '../oauth/dto/oauth-access-token-response.dto';
import { TrxService } from '../trx/trx.service';
import { OauthService } from '../oauth/oauth.service';
import { plainToInstance } from 'class-transformer';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';

@Injectable()
export class WhooLoopService {
  constructor(
    private readonly trxService: TrxService,
    private readonly oauthService: OauthService,
    private readonly whooingApi: WhooingResourceApiService,
    private readonly logRepository: LogRepository,
  ) {}

  // 매일 23시 59분 35초에 오늘이 종료일인 거래 OFF 처리
  @Cron('35 59 23 * * *')
  async dailyCronForExpire() {
    const today: string = getToday();
    this.trxService.turnOffExpiredTrxs(today);
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
    const whooingInputForm: WhooingInputForm = this._makeWhooingInputForm(data);
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

    // 로그 저장 준비
    const logData = new LogEntity();
    logData.request_url = config.url;
    logData.request_body = dataJson;
    logData.transaction_idx = data.transaction_idx;

    axios
      .request(config)
      .then((response) => {
        logData.response_body = response.data;
        this.logRepository.create(logData);
        if (response.data !== 'done') {
          this.sendErrorAlarmByWhooingMessage(logData);
        }
      })
      .catch((error) => {
        logData.response_body = error.data;
        this.logRepository.create(logData);
        this.sendErrorAlarmByWhooingMessage(logData);
      });
  }

  async sendErrorAlarmByWhooingMessage(logData: LogEntity): Promise<void> {
    const targetUserId = await this.trxService.findUserIdxByTrxIdx(
      logData.transaction_idx,
    );
    const whooingAccessData: OauthAccessTokenResponseDto = plainToInstance(
      OauthAccessTokenResponseDto,
      await this.oauthService.findUserIdxByWhooingUserId(
        WHOOING_USER_ID_OF_APP_MASTER,
      ),
      {
        excludeExtraneousValues: true,
      },
    ); // snake_case -> camelCase
    const message = `[후룹 에러 알림] ${logData.request_body} 거래 자동입력 중 다음과 같은 후잉 웹훅 에러가 발생했습니다. ${logData.response_body}`;
    await this.whooingApi.sendMessageByWhooingApi(
      targetUserId,
      message,
      whooingAccessData,
    );
  }

  private _makeWhooingInputForm(data: WhooingInputData): WhooingInputForm {
    return {
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
    const result = await this.trxService.findByTime(
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
