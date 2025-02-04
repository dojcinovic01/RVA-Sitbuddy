import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; 
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, 
  ) {}

  /**
   * Validacija korisnika na osnovu email-a i lozinke.
   * @param email Email korisnika
   * @param password Lozinka korisnika
   * @returns Validirani korisnik ili null ako ne postoji
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; 
      return result;
    }
    return null;
  }

  /**
   * Generisanje JWT tokena za prijavljenog korisnika.
   * @param user Korisnik za kojeg se generiše token
   * @returns JWT token
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, userType: user.userType };
  
    // Generiši token
    const token = this.jwtService.sign(payload);
  
    // Vrati i korisničke podatke i token
    return {
      user: user,       // Korisnički podaci (bez lozinke)
      token: token      // JWT token
    };
  }
  
}
