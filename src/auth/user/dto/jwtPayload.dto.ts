import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JwtPayload {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  mobileNo: string;

  @IsEmail()
  email: string;
}
