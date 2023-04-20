import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { TestUsersService } from './users.service';
import { TestAuthService } from './auth.service';
import { AuthService } from '../auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: TestUsersService;
  let fakeAuthService: TestAuthService;

  beforeEach(async () => {
    fakeUsersService = new TestUsersService();
    fakeAuthService = new TestAuthService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of all users', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';
    await fakeUsersService.create(email, password);
    const users = await controller.findAllUsers('test@gmail.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(email);
  });

  it('findUser return a single user with a given id', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';
    const createdUser = await fakeUsersService.create(email, password);
    const user = await controller.findUser(createdUser.id.toString());

    expect(user).toBeDefined();
    expect(user.id).toEqual(createdUser.id);
  });

  it('findUser throws an error if user with a given id not found', async () => {
    await expect(controller.findUser('1')).rejects.toThrowError(
      new NotFoundException('User not found'),
    );
  });

  it('signIn updates session and returns user', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';
    const session: Record<string, any> = {};
    const user = await controller.signIn({ email, password }, session);

    expect(user).toBeDefined();
    expect(session.userId).toBeDefined();
    expect(session.userId).toEqual(1);
  });

  it('createUser updates session and returns user', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';
    const session: Record<string, any> = {};
    const user = await controller.createUser({ email, password }, session);

    expect(user).toBeDefined();
    expect(session.userId).toBeDefined();
    expect(session.userId).toEqual(1);
  });

  it('signOut updates session', async () => {
    const session: Record<string, any> = {
      userId: 1,
    };

    await controller.signOut(session);

    expect(session.userId).toBeNull();
  });
});
