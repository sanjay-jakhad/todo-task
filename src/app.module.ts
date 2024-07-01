import { Module } from '@nestjs/common';
import { userModule } from './auth/user';
import { todoModule } from './auth/todo';

@Module({
  imports: [userModule, todoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
