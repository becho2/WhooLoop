import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';

/**
 * account = 후잉 계정항목을 뜻함
 * 후잉 계정항목들을 불러와서 저장하고 항목의 목록을 프론트로 보내줌
 */
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async refresh(@Request() req: any, @Body() body: { sectionIdx: number }) {
    return await this.accountService.refresh(req.user.idx, body.sectionIdx);
  }

  @Get(':sectionIdx')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async findOne(@Param('sectionIdx') sectionIdx: string) {
    return await this.accountService.findOneBySectionIdx(+sectionIdx);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
