import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionRepository } from './section.repository';
import { SectionEntity } from './entities/section.entity';
import { FindAllApiResponseDto } from './dto/find-all-api-response.dto';
import { WhooingSectionResponseDto } from './dto/whooing-section-response.dto';
import { OauthAccessTokenResponseDto } from '../oauth/dto/oauth-access-token-response.dto';
import { API_SECTIONS_URL } from '../lib/constants';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';

@Injectable()
export class SectionService {
  constructor(
    private readonly sectionRepository: SectionRepository,
    private readonly whooingApi: WhooingResourceApiService,
  ) {}

  async create(createSectionDto: CreateSectionDto) {
    return this.sectionRepository.create(createSectionDto);
  }

  async createMany(createSectionList: CreateSectionDto[]) {
    return this.sectionRepository.createMany(createSectionList);
  }

  async update(sectionIdx: number, updateSectionDto: UpdateSectionDto) {
    return await this.sectionRepository.update(sectionIdx, updateSectionDto);
  }

  async findAll(userIdx: number): Promise<SectionEntity[]> {
    return await this.sectionRepository.findAll(userIdx);
  }

  async findAllForFront(userIdx: number): Promise<FindAllApiResponseDto[]> {
    const sectionList = await this.sectionRepository.findAll(userIdx);
    return sectionList.map((section) => {
      return {
        section_idx: section.section_idx,
        section_name: section.section_name,
        whooing_webhook_token: section.whooing_webhook_token,
      };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  async remove(idx: number, userIdx: number): Promise<boolean> {
    return await this.sectionRepository.remove(idx, userIdx);
  }

  async getWhooingSectionInfo(
    whooingAccessData: OauthAccessTokenResponseDto,
  ): Promise<WhooingSectionResponseDto[]> {
    const sectionList: WhooingSectionResponseDto[] =
      await this.whooingApi.resourceApiRequest(
        API_SECTIONS_URL,
        whooingAccessData,
      );
    return sectionList;
  }

  /**
   * @param userIdx
   * @param whooingAccessData
   */
  async createWhooingSections(
    userIdx: number,
    sectionList: WhooingSectionResponseDto[],
  ) {
    const createSectionList: CreateSectionDto[] = [];
    sectionList.forEach((section: WhooingSectionResponseDto, index: number) => {
      const createSectionData: CreateSectionDto = {
        user_idx: userIdx,
        section_name: section.title,
        whooing_section_id: section.section_id,
        whooing_webhook_token: section.webhook_token,
        sort_no: index,
      };
      createSectionList.push(createSectionData);
    });

    this.createMany(createSectionList);
    return sectionList.map(
      (section: WhooingSectionResponseDto) => section.section_id,
    );
  }

  /**
   * 기존에 없던 추가된 섹션 찾아서 추가
   * @param userIdx
   * @param whooingAccessData
   */
  async addSections(
    userIdx: number,
    nowSectionList: WhooingSectionResponseDto[],
  ): Promise<boolean> {
    // 기존 입력돼있는 섹션리스트 불러오기
    const prevSectionList = await this.findAll(userIdx);
    const prevSectionIds: string[] = prevSectionList.map(
      (section) => section.whooing_section_id,
    );
    const nowSectionIds: string[] = nowSectionList.map(
      (section: WhooingSectionResponseDto) => section.section_id,
    );
    // 기존 섹션리스트와 현재 섹션 리스트의 whooing section_id 값을 비교해서 기존에 없던 새로운 id만 찾기
    const sectionIdsNeedToBeAdded: string[] = nowSectionIds.filter(
      (id: string) => !prevSectionIds.includes(id),
    );
    if (sectionIdsNeedToBeAdded.length === 0) {
      return false;
    }
    // 기존에 없던 새로운 id를 가진 섹션정보만 남긴 리스트 생성
    const sectionsNeedToBeAdded = nowSectionList.filter(
      (section: WhooingSectionResponseDto) =>
        sectionIdsNeedToBeAdded.includes(section.section_id),
    );

    await this.createWhooingSections(userIdx, sectionsNeedToBeAdded);
    return true;
  }
}
