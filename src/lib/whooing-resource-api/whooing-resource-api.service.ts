import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { OauthAccessTokenResponseDto } from '../../oauth/dto/oauth-access-token-response.dto';

@Injectable()
export class WhooingResourceApiService {
  async resourceApiRequest(
    url: string,
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    const signature = crypto
      .createHash('sha1')
      .update(
        `${process.env.WHOOING_APP_SECRET}|${whooingAccessData.whooingAccessTokenSecret}`,
      )
      .digest('hex');

    const data = {
      app_id: process.env.WHOOING_APP_ID,
      token: whooingAccessData.whooingAccessToken,
      signiture: signature,
      nounce: `${+new Date()}-${Math.random()}`,
      timestamp: +new Date() / 1000,
    };

    const xApiKey = Object.keys(data).map((k) => {
      return `${k}=${data[k]}`;
    });
    const requestConfig = {
      method: 'get',
      url: url,
      headers: {
        'x-api-key': xApiKey.join(','),
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };
    return await axios
      .request(requestConfig)
      .then((response) => {
        if (response.data.code !== 200) {
          throw new BadRequestException(response.data.message);
        }
        console.log(response.data.results);
        return response.data.results;
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error.message);
      });
  }
}
