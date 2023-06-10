import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // for health check
    return 'Hello! 후룹 서비스를 이용하시려면 여기로 이동해주세요. <a href="http://146.56.136.6:5173">WhooLoop</a>';
  }
}
