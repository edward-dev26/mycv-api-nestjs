import { CanActivate, ExecutionContext } from '@nestjs/common';

import { User } from '../users/user.entity';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.currentUser as User;

    if (!user) {
      return false;
    }

    return user.admin;
  }
}
