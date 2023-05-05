import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwtAccessGuard') {
  /**
   * PassportStrategy extends시
   * 1st param: 무엇으로 인증할 것인지
   * 2nd guards name
   */
}
