import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwtPayload.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new BadRequestException('User Already exist , please Login');
      }

      const hashedPassword = await this.hashedPassword(dto.password);

      const createUserData = await this.prisma.user.create({
        data: {
          name: dto.name,
          lastName: dto.lastName,
          email: dto.email,
          password: hashedPassword,
          mobileNo: dto.mobileNo,
        },
      });

      return {
        statusCode: 200,
        message: 'User signUp Successfully',
        data: createUserData,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error..');
    }
  }

  async login(dto: LoginDto, req: Request, res: Response) {
    try {
      const checkUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (checkUser) {
        const comparePass = await this.comparePassword({
          password: dto.password,
          hash: checkUser.password,
        });

        if (!comparePass) {
          throw new NotFoundException('Wrong Password, please check');
        }
        const token = await this.signToken({
          userId: checkUser.id,
          name: checkUser.name,
          mobileNo: checkUser.mobileNo,
          email: checkUser.email,
        });

        if (!token) {
          throw new UnauthorizedException();
        }
        return res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          token: token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'User Not Found, Please SignUp first',
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error..2');
    }
  }

  private async hashedPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    return hashPassword;
  }

  private async comparePassword(args: { password: string; hash: string }) {
    const isMatch = await bcrypt.compare(args.password, args.hash);
    return isMatch;
  }

  private async signToken(args: {
    userId: number;
    name: string;
    mobileNo: string;
    email: string;
  }) {
    const payload: JwtPayload = {
      userId: args.userId,
      name: args.name,
      mobileNo: args.mobileNo,
      email: args.email,
    };
    return this.jwtService.signAsync(payload, {
      secret: 'SANJAY!@#123',
      expiresIn: '1h',
    });
  }
}
