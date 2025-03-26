import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validacija JWT payload-a.
   * @param payload Token payload koji sadrži korisničke podatke.
   * @returns Objekat sa korisničkim ID-em, email-om i tipom korisnika.
   */
  async validate(payload: { sub: number; email: string; userType: string }) {
    return { userId: payload.sub, email: payload.email, userType: payload.userType };
  }
}
