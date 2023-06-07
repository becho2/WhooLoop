import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestTokenInputDto } from './dto/request-token-input.dto';
import axios from 'axios';
import { RequestTokenOutputDto } from './dto/request-token-output.dto';
import { OauthLoginInputDto } from './dto/oauth-login-input.dto';
import { OauthAccessTokenResponseDto } from './dto/oauth-access-token-response.dto';
import { OauthAccessTokenRequestDto } from './dto/oauth-access-token-request.dto';
import { OauthUserRepository } from './oauth-user.repository';
import { CreateOauthUserDto } from './dto/create-oauth-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateOauthUserDto } from './dto/update-oauth-user.dto';
import { AuthService } from '../auth/auth.service';
import * as crypto from 'crypto';
import { API_SECTIONS_URL } from '../lib/constants';

@Injectable()
export class OauthService {
  constructor(
    private readonly oauthUserRepository: OauthUserRepository,
    private readonly authService: AuthService,
  ) {}
  /**
   * 후잉 Oauth Service 이용을 위한 첫단계, 이 앱의 ID, Secret을 통해 token을 받고
   * 해당 토큰과 함께 유저를 후잉로그인 화면으로 보낼 url을 만들어서 리턴
   * @returns 후잉 로그인(인증) url
   */
  async requestOauthLogin(): Promise<RequestTokenOutputDto> {
    const requestTokenUrl = 'https://whooing.com/app_auth/request_token';
    const requestTokenDto: RequestTokenInputDto = {
      appId: process.env.WHOOING_APP_ID,
      appSecret: process.env.WHOOING_APP_SECRET,
    };

    const requestTokenConfig = {
      method: 'get',
      url:
        requestTokenUrl +
        `?app_id=${requestTokenDto.appId}&app_secret=${requestTokenDto.appSecret}`,
    };

    const requestToken: string = await axios
      .request(requestTokenConfig)
      .then((response) => {
        return response.data.token;
      })
      .catch((error) => {
        console.log(error);
      });

    const requestAuthorizationUrl = `https://whooing.com/app_auth/authorize?token=${requestToken}`;
    return {
      requestToken: requestToken,
      whooingAuthUrl: requestAuthorizationUrl,
    };
  }

  async oauthLogin(oauthLoginInput: OauthLoginInputDto) {
    let userIdx = 0;
    const whooingAccessData: OauthAccessTokenResponseDto =
      await this.getAccessData(oauthLoginInput);

    const user = await this.findUserIdxByWhooingUserId(
      whooingAccessData.whooingUserId,
    );

    // 후잉 user id가 DB에 없을 경우 insert, 이미 있을 경우 토큰만 update
    if (user === undefined) {
      userIdx = await this.createOauthUser(whooingAccessData);
      if (userIdx) {
        await this.afterCreateUser(userIdx, whooingAccessData);
      }
    } else {
      this.updateOauthUser(user.user_idx, whooingAccessData);
      userIdx = user.user_idx;
      await this.afterCreateUser(userIdx, whooingAccessData);
    }

    return this.authService.getAccessToken(
      whooingAccessData.whooingUserId,
      userIdx,
    );
  }

  /**
   * 첫 로그인시 create user 후 처리
   * 해당 user id에 존재하는 섹션리스트를 검색해서 DB에 넣어주기
   * @param whooingAccessData
   */
  async afterCreateUser(
    userIdx: number,
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    const sectionList = await this.resourceApiRequest(
      API_SECTIONS_URL,
      whooingAccessData,
    );
  }

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

  async getAccessData(
    oauthLogin: OauthLoginInputDto,
  ): Promise<OauthAccessTokenResponseDto> {
    const requestData: OauthAccessTokenRequestDto = {
      appId: process.env.WHOOING_APP_ID,
      appSecret: process.env.WHOOING_APP_SECRET,
      token: oauthLogin.requestToken,
      pin: oauthLogin.pin,
    };

    const requestAccessTokenUrl = 'https://whooing.com/app_auth/access_token';
    const requestTokenConfig = {
      method: 'get',
      url:
        requestAccessTokenUrl +
        `?app_id=${requestData.appId}` +
        `&app_secret=${requestData.appSecret}` +
        `&token=${requestData.token}` +
        `&pin=${requestData.pin}`,
    };
    const accessTokenData = await axios
      .request(requestTokenConfig)
      .then((response) => {
        if (response.data.code !== 200) {
          throw new BadRequestException(response.data.message);
        }
        const accessTokenData: OauthAccessTokenResponseDto = {
          whooingUserId: parseInt(response.data.user_id),
          whooingAccessToken: response.data.token,
          whooingAccessTokenSecret: response.data.token_secret,
        };
        return accessTokenData;
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error.message);
      });
    return accessTokenData;
  }

  async createOauthUser(
    whooingAccessData: OauthAccessTokenResponseDto,
  ): Promise<number> {
    const createData: CreateOauthUserDto = plainToInstance(
      CreateOauthUserDto,
      whooingAccessData,
      {
        excludeExtraneousValues: true,
      },
    );
    return await this.oauthUserRepository.create(createData);
  }

  async updateOauthUser(
    userIdx: number,
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    const updateData: UpdateOauthUserDto = plainToInstance(
      UpdateOauthUserDto,
      whooingAccessData,
      {
        excludeExtraneousValues: true,
      },
    );
    return await this.oauthUserRepository.update(userIdx, updateData);
  }

  async findOne(idx: number) {
    return await this.oauthUserRepository.findOne(idx);
  }

  async findUserIdxByWhooingUserId(id: number): Promise<any> {
    return await this.oauthUserRepository.findUserIdxByWhooingUserId(id);
  }
}
