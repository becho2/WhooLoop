import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class OauthService {
  constructor(private readonly oauthUserRepository: OauthUserRepository) {}
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
    const whooingAccessData: OauthAccessTokenResponseDto =
      await this.getAccessData(oauthLoginInput);

    const user = await this.findUserIdxByWhooingUserId(
      whooingAccessData.whooingUserId,
    );
    if (user.user_idx === undefined) {
      this.createOauthUser(whooingAccessData);
    } else {
      this.updateOauthUser(user.user_idx, whooingAccessData);
    }

    return user.user_idx;
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
        const accessTokenData: OauthAccessTokenResponseDto = {
          whooingUserId: parseInt(response.data.user_id),
          whooingAccessToken: response.data.token,
          whooingAccessTokenSecret: response.data.token_secret,
        };
        return accessTokenData;
      })
      .catch((error) => {
        console.log(error);
      });
    if (!accessTokenData) {
      throw new InternalServerErrorException('Did not get access token');
    }
    return accessTokenData;
  }

  async createOauthUser(whooingAccessData: OauthAccessTokenResponseDto) {
    const createData: CreateOauthUserDto = plainToInstance(
      CreateOauthUserDto,
      whooingAccessData,
      {
        excludeExtraneousValues: true,
      },
    );
    console.log(createData);
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
