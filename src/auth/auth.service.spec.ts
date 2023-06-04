import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot({
          envFilePath: [
            `${__dirname}/../config/env/.${process.env.NODE_ENV}.env`,
          ],
          isGlobal: true,
        }),
      ],
      providers: [JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
