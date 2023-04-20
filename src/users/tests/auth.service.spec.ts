import { Test } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { TestUsersService } from './users.service';

describe('AuthService', () => {
  let fakeUsersService: TestUsersService;
  let service: AuthService;

  beforeEach(async () => {
    fakeUsersService = new TestUsersService();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with salted and hashed password', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';
    const user = await service.signUp(email, password);
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email in use', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';

    await service.signUp(email, password);

    await expect(service.signUp(email, password)).rejects.toThrowError(
      new BadRequestException('Email in use'),
    );
  });

  it('throws if sign in called with unused email ', async () => {
    const errorMessage = 'Invalid email or password';
    const email = 'test@gmail.com';
    const password = '12345678';

    await expect(service.signIn(email, password)).rejects.toThrowError(
      new ForbiddenException(errorMessage),
    );
  });

  it('throws if an invalid password is provided', async () => {
    const errorMessage = 'Invalid email or password';
    const email = 'test@gmail.com';
    const password = '12345678';

    await service.signUp(email, 'Some password');

    await expect(service.signIn(email, password)).rejects.toThrowError(
      new ForbiddenException(errorMessage),
    );
  });

  it('returns a user if correct password is provided', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';

    await service.signUp(email, password);

    const user = await service.signIn(email, password);

    expect(user).toBeDefined();
  });
});
