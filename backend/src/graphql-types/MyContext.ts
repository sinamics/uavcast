import { Request, Response } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: any;
  }
}
export interface MyContext {
  req: Request;
  res: Response;
}
