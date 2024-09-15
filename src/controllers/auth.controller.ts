import { Request, Response } from 'express';
import User from '../models/user.model';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface LogoutRequest extends Request {
  user: any
}

interface VerifyEmailRequest extends Request {
  user: any;
  body: {
    token: string;
  };
}

export const login = async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Login failed!' });
  }
};

export const logout = async (req: LogoutRequest, res: Response) => {
  try {
    const user = req.user;
    if (user) {
      await user.logout();
      res.status(200).send({ message: 'Logged out successfully!' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Logout failed!' });
  }
};

export const verifyEmail = async (req: VerifyEmailRequest, res: Response) => {
  try {
    const user = req.user;
    const { token } = req.body;

    if (user && await user.verifyEmail(token)) {
      res.status(200).send({ message: 'Email verified successfully!' });
    } else {
      res.status(400).send({ error: 'Invalid token!' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Verification failed!' });
  }
};
