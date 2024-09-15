import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new Error("token not found");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as { _id: string };
  const user = await User.findOne({ _id: decoded._id, token });

  if (!user) {
    throw new Error();
  }

  req.token = token;
  req.user = user;
  next();

};
