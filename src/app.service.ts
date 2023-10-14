import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // for health check
    return `Hello! <br />
      후룹 서비스를 이용하시려면 여기로 이동해주세요. <a href="https://whooloop.todakbank.org">WhooLoop</a> <br />
      API 문서는 <a href="https://api.whooloop.todakbank.org/docs">여기</a>를 참고해주세요.`;
  }
}
