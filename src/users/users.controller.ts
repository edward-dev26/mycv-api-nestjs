import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('sign-up')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }
}
