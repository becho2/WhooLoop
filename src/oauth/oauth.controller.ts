import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { RequestTokenOutputDto } from './dto/request-token-output.dto';
import { OauthLoginInputDto } from './dto/oauth-login-input.dto';

// whooing Oauth 인증을 이용하기 위한 API
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get()
  async requestOauthLogin(): Promise<RequestTokenOutputDto> {
    return await this.oauthService.requestOauthLogin();
  }

  @Post()
  async oauthLogin(@Body() oauthLoginInput: OauthLoginInputDto): Promise<any> {
    return await this.oauthService.oauthLogin(oauthLoginInput);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oauthService.findOne(+id);
  }
}
