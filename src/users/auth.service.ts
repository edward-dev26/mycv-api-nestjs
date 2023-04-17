import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    const hashedPassword = await this.hashPassword(password);

    return this.usersService.create(email, hashedPassword);
  }

  private async hashWithSalt(password: string, salt: string) {
    const buffer = (await scrypt(password, salt, 32)) as Buffer;

    return buffer.toString('hex');
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = await this.hashWithSalt(password, salt);

    return salt + '.' + hash;
  }

  async signIn(email: string, password: string) {
    const errorMessage = 'Invalid email or password';
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new ForbiddenException(errorMessage);
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException(errorMessage);
    }

    return user;
  }

  private async verifyPassword(password: string, passwordWithSalt: string) {
    const [salt, storedPassword] = passwordWithSalt.split('.');
    const hash = await this.hashWithSalt(password, salt);

    return hash === storedPassword;
  }
}
