import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    //console.log('JWT_SECRET:', secret); // Dodaj ovo da proveriš vrednost
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), 
      
    });
  }

  async validate(payload: any) {
    console.log('Payload:', payload); 
    return { userId: payload.sub, email: payload.email, userType: payload.userType }; 
}

}
