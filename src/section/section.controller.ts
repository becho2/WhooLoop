import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FindAllApiResponseDto } from './dto/find-all-api-response.dto';

@ApiTags('section')
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a section' })
  @ApiResponse({
    status: 201,
    description: 'Create a section',
    isArray: false,
  })
  @UseGuards(AuthGuard('jwtAccessGuard'))
  create(@Request() req: any, @Body() createSectionDto: CreateSectionDto) {
    createSectionDto.user_idx = req.user.idx;
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections of a user' })
  @ApiResponse({
    status: 200,
    description: 'Get sections successfully',
    isArray: true,
  })
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async findAll(@Request() req: any): Promise<FindAllApiResponseDto[]> {
    return await this.sectionService.findAllForFront(req.user.idx);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(+id);
  }

  @Patch(':idx')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  update(
    @Param('idx') idx: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionService.update(+idx, updateSectionDto);
  }

  @Delete(':idx')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  async remove(
    @Param('idx') idx: string,
    @Request() req: any,
  ): Promise<boolean> {
    return await this.sectionService.remove(+idx, req.user.idx);
  }
}
