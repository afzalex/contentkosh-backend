import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { IUser } from '../dtos/auth.dto';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    console.log(await bcrypt.hash(password, 10));
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: IUser): string {
    const secret = Buffer.from(config.jwt.secret, 'utf8');
    return jwt.sign({
      userId: user.id,
      businessId: user.businessId,
      role: user.role
    }, secret, { 
      expiresIn: '24h'
    });
  }

  static verifyToken(token: string): IUser | null {
    try {
      const secret = Buffer.from(config.jwt.secret, 'utf8');
      const decoded = jwt.verify(token, secret) as IUser;
      return decoded
    } catch (error) {
      return null;
    }
  }
}
