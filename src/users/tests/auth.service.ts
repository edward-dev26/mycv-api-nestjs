import { User } from '../user.entity';

export class TestAuthService {
  async signIn(email: string, password: string) {
    return {
      id: 1,
      email,
      password,
    } as User;
  }

  async signUp(email: string, password: string) {
    return {
      id: 1,
      email,
      password,
    } as User;
  }
}
