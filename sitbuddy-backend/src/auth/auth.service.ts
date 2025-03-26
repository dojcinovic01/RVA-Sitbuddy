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
   * @returns Validirani korisnik bez lozinke ili null ako ne postoji
   */
  async validateUser(email: string, password: string): Promise<Omit<any, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Generisanje JWT tokena za prijavljenog korisnika.
   * @param user Korisnik za kojeg se generiše token
   * @returns Objekat sa korisnikom i tokenom
   */
  async login(user: any): Promise<{ user: Omit<any, 'password'>; token: string }> {
    const payload = { email: user.email, sub: user.id, userType: user.userType };
    const token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
