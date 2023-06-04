import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwtAccessGuard',
) {
  /**
   * PassportStrategy extends시
   * 1st param: 무엇으로 인증할 것인지
   * 2nd guards name
   */

  constructor() {
    // 부모클래스에 정보를 던져주기
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // request로 들어온 jwt token 입력
      secretOrKey: process.env.JWT_ACCESS_KEY,
    });
  }

  /**
   * 생성자에서 super를 이용해 던진 정보를 부모클래스에서 해당 키값으로 서명sign된 게 맞는지 검증
   * 실패시 에러, (인가(Authorization)) 성공시 부모클래스가 validate() 호출해줌
   * @return object - 객체 리턴시 request에 원래는 없던 user라는 이름(passport에서 설정한 것으로 임의변경불가)으로 데이터 들어감
   * 인가 통과 뒤에 req.user.email, req.uesr.idx 등으로 validate()에서 return한 데이터들을 쓸 수 있게 됨
   */
  validate(payload: { email: string; user_idx: number }) {
    return { email: payload.email, idx: payload.user_idx };
  }
}
