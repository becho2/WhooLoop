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
import { SelectAccountOutputDto } from './dto/select-account-output.dto';
import { SelectFrequentItemsOutputDto } from './dto/select-frequent-items-output.dto';

/**
 * account = 후잉 계정항목을 뜻함
 * 후잉 계정항목들을 불러와서 저장하고 항목의 목록을 프론트로 보내줌
 */
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async refresh(
    @Request() req: any,
    @Body() body: { sectionIdx: number },
  ): Promise<SelectAccountOutputDto> {
    return await this.accountService.refresh(req.user.idx, body.sectionIdx);
  }

  @Get(':sectionIdx/accounts')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async findOne(
    @Request() req: any,
    @Param('sectionIdx') sectionIdx: string,
  ): Promise<SelectAccountOutputDto> {
    return await this.accountService.findOneBySectionIdx(
      req.user.idx,
      +sectionIdx,
    );
  }

  @Get(':sectionIdx/frequents')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async findFrequentItems(
    @Param('sectionIdx') sectionIdx: string,
  ): Promise<SelectFrequentItemsOutputDto[]> {
    return await this.accountService.findFrequentItemsBySectionIdx(+sectionIdx);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
