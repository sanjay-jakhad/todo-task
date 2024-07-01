import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../user/dto/jwtPayload.dto';
import { PrismaService } from '../prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SANJAY!@#123',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, mobileNo: true },
    });
    if (!user) {
      throw new UnauthorizedException('Unauthorized: User have no permission');
    }
    return {
      id: payload.userId,
      email: payload.email,
      mobileNo: payload.mobileNo,
    };
  }
}
