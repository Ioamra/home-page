import { Request } from 'express';

export interface UserInfoInJwt {
  id: number;
  email: string;
}

export interface CustomRequest extends Request {
  user: UserInfoInJwt;
}
