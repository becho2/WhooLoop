import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DBModule } from '../lib/db/db.module';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.skip('should throw bad request error', async () => {
    const testCreateUserDto = new CreateUserDto();
    testCreateUserDto.email = 'whooingeveryday@gmail.com';
    testCreateUserDto.password = 'password';

    // @TODO: 테스트 실행시 DB connection failed. 원인 찾거나 DB연결없는 test로 대체 필요
    await expect(async () => {
      service.create(testCreateUserDto);
    }).rejects.toThrowError(new BadRequestException('Email already exists'));
  });
});
