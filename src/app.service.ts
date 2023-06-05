import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // for health check
    return 'Hello WhooLoop Home!';
  }
}
