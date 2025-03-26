import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // Koristimo email umesto defaultnog 'username'
  }

  /**
   * Validacija korisničkih kredencijala.
   * @param email Email korisnika.
   * @param password Lozinka korisnika.
   * @returns Validirani korisnik ili baca grešku ako nije pronađen.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Nevalidna e-adresa ili lozinka.');
    }
    return user;
  }
}
