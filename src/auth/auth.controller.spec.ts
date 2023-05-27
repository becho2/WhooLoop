import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DBModule } from '../lib/db/db.module';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { UserOracle } from '../user/user.oracle';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UserService,
        UserRepository,
        UserOracle,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
