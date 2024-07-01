import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone('en-IN')
  @IsOptional()
  mobileNo?: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
