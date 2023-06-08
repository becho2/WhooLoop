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
import { SectionService } from '../section/section.service';
import { CreateSectionDto } from '../section/dto/create-section.dto';
import { UpdateSectionDto } from '../section/dto/update-section.dto';

@Injectable()
export class OauthService {
  constructor(
    private readonly oauthUserRepository: OauthUserRepository,
    private readonly authService: AuthService,
    private readonly sectionService: SectionService,
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
      // accesstoken이랑 secret도 같으면 update 굳이 할 필요 없음
      if (
        !(
          user.whooing_access_token === whooingAccessData.whooingAccessToken &&
          user.whooing_access_token_secret ===
            whooingAccessData.whooingAccessTokenSecret
        )
      ) {
        // 토큰이나 토큰시크릿이 달라졌을 경우 해당 정보 업데이트
        this.updateOauthUser(user.user_idx, whooingAccessData);
      }
      userIdx = user.user_idx;
      // 이미 등록된 유저일 때, 기존에 등록된 섹션 외에 새로운 섹션이 생겼는지 확인해서 추가 insert
      await this.addSections(userIdx, whooingAccessData);
      // @TODO (우선순위: Low) 이미 등록된 섹션 중 이름이 변경된 섹션 확인해서 update
      // await this.updateSections(userIdx, whooingAccessData);
    }

    return this.authService.getAccessToken(
      whooingAccessData.whooingUserId,
      userIdx,
    );
  }

  /**
   * 후잉 Oauth 첫 로그인시 유저를 새로 생성하고 난 후 후처리
   * @param userIdx
   * @param whooingAccessData
   */
  async afterCreateUser(
    userIdx: number,
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    // 해당 후잉 계정에 속한 섹션 리스트를 불러와서 저장한다
    const sectionList = await this.resourceApiRequest(
      API_SECTIONS_URL,
      whooingAccessData,
    );
    await this.createWhooingSections(userIdx, sectionList);
  }

  /**
   * 기존에 없던 추가된 섹션 찾아서 추가
   * @param userIdx
   * @param whooingAccessData
   */
  async addSections(
    userIdx: number,
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    // 기존 입력돼있는 섹션리스트 불러오기
    const prevSectionList = await this.sectionService.findAll(userIdx);
    const prevSectionIds: string[] = prevSectionList.map(
      (section) => section.whooing_section_id,
    );

    // 현재 해당 후잉계정의 섹션리스트 가져오기
    const nowSectionList = await this.resourceApiRequest(
      API_SECTIONS_URL,
      whooingAccessData,
    );
    const nowSectionIds = nowSectionList.map(
      (section: any) => section.section_id,
    );

    // 기존 섹션리스트와 현재 섹션 리스트의 whooing section_id 값을 비교해서 기존에 없던 새로운 id만 찾기
    const sectionIdsNeedToBeAdded: UpdateSectionDto[] = nowSectionIds.filter(
      (id: string) => !prevSectionIds.includes(id),
    );
    if (sectionIdsNeedToBeAdded.length === 0) {
      return false;
    }
    // 기존에 없던 새로운 id를 가진 섹션정보만 남긴 리스트 생성
    const sectionsNeedToBeAdded = nowSectionList.filter((section: any) =>
      sectionIdsNeedToBeAdded.includes(section.section_id),
    );

    await this.createWhooingSections(userIdx, sectionsNeedToBeAdded);
  }

  /**
   * @param userIdx
   * @param whooingAccessData
   */
  async createWhooingSections(userIdx: number, whooingSectionList: any) {
    const createSectionList: CreateSectionDto[] = [];
    whooingSectionList.forEach((section: any, index: number) => {
      const createSectionData: CreateSectionDto = {
        user_idx: userIdx,
        section_name: section.title,
        whooing_section_id: section.section_id,
        whooing_webhook_token: section.webhook_token,
        sort_no: index,
      };
      createSectionList.push(createSectionData);
    });

    this.sectionService.createMany(createSectionList);
  }

  // @TODO (우선순위: Low) 이미 등록돼있는 섹션 이름이 변경됐을 경우 update
  // async updateSections(
  //   userIdx: number,
  //   whooingAccessData: OauthAccessTokenResponseDto,
  // ): Promise<boolean> {
  //   const rawPrevSectionList = await this.sectionService.findAll(userIdx);
  //   const prevSectionList: MinCommonSectionInfoDto[] = rawPrevSectionList.map(
  //     (section) => {
  //       return {
  //         section_name: section.section_name,
  //         whooing_section_id: section.whooing_section_id,
  //         whooing_webhook_token: section.whooing_webhook_token,
  //       };
  //     },
  //   );
  //   const rawSectionListNow = await this.resourceApiRequest(
  //     API_SECTIONS_URL,
  //     whooingAccessData,
  //   );
  //   const sectionListNow = rawSectionListNow.map((section: any) => {
  //     return {
  //       section_name: section.title,
  //       whooing_section_id: section.section_id,
  //       whooing_webhook_token: section.webhook_token,
  //     };
  //   });
  //   // 현재 섹션 리스트에서 예전에 등록돼있던 섹션 리스트에
  //   const sectionsNeedToBeUpdated: UpdateSectionDto[] = sectionListNow.filter(
  //     (section: MinCommonSectionInfoDto) => !prevSectionList.includes(section),
  //   );

  //   if (sectionsNeedToBeUpdated.length === 0) {
  //     return false;
  //   } else {
  //     for (const section of sectionsNeedToBeUpdated) {
  //       await this.sectionService.update(section);
  //     }
  //     return true;
  //   }
  // }

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
