import { User } from '../user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';

export class TestUsersService {
  private users: User[] = [];

  async findOne(id: number) {
    return this.users.find((u) => u.id === id);
  }

  async find(email: string) {
    return this.users.filter((u) => u.email === email);
  }

  async create(email: string, password: string) {
    const user = {
      id: Date.now(),
      email,
      password,
    } as User;

    this.users.push(user);

    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    return {
      id,
      ...data,
    } as User;
  }

  async remove(id: number) {
    return {
      id,
      email: 'test@gmail.com',
      password: 'Some password',
    } as User;
  }
}
