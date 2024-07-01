import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { userModule } from '../user';

@Module({
  imports: [userModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class todoModule {}
