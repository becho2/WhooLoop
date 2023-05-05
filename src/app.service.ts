import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    //@todo MVC구조 정착되면 삭제 예정
    return 'Hello Whooing Everyday Home!';
  }
}
