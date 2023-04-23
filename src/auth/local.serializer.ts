import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    private userRepository: UserRepository,
  ) {
    super();
  }

  serializeUser(user: UserEntity, done: CallableFunction) {
    console.log(user);
    done(null, user.user_idx);
  }

  async deserializeUser(userIdx: number, done: CallableFunction) {
    return await this.userRepository
      .findOneOrFail(userIdx)
      .then((user) => {
        console.log('user: ', user);
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
