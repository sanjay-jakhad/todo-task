import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTodoDto) {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title: dto.title,
          content: dto.content,
          completed: dto.completed,
          userId: userId,
        },
      });
      return todo;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error when trying to create todo list',
      );
    }
  }

  async findAll(userId: number, page: number, limit: number, search: string) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        OR: search
          ? [
              { title: { contains: search, mode: 'insensitive' as const } },
              { content: { contains: search, mode: 'insensitive' as const } },
            ]
          : undefined,
      };

      const todos = await this.prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'desc' as const,
        },
      });

      const total = await this.prisma.todo.count({ where });

      return {
        data: todos,
        totalTodo: total,
        pageNo: page,
        pageCount: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error when try to get all todo list data',
      );
    }
  }

  async findOne(userId: number, id: number) {
    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id, userId },
      });

      if (!todo) {
        throw new NotFoundException('Todo for this id not found in db');
      }

      return todo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error when try to get all todo list data',
      );
    }
  }

  async update(userId: number, id: number, dto: UpdateTodoDto) {
    try {
      const todo = await this.prisma.todo.updateMany({
        where: { userId: userId, id: id },
        data: dto,
      });

      if (todo.count === 0) {
        throw new NotFoundException('Todo for this id not found in db');
      }

      return todo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error when to update todo list');
    }
  }

  async remove(userId: number, id: number) {
    try {
      const todo = await this.prisma.todo.deleteMany({
        where: { id, userId },
      });

      if (todo.count === 0) {
        throw new NotFoundException('Todo for this id not found in db');
      }

      return todo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error when trying to delete this todo',
      );
    }
  }
}
