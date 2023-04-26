import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session?.userId as number | undefined;

    if (userId) {
      req.currentUser = await this.usersService.findOne(userId);
    }

    next();
  }
}
