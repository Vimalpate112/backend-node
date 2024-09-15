import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role?: string;
  token?: string;
  emailVerificationToken?: string;
  generateAuthToken(): Promise<string>;
  logout(): Promise<void>;
  verifyEmail(token: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String
  },
  token: {
    type: String
  },
  emailVerificationToken: {
    type: String
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

userSchema.pre<IUser>('save', async function (next: NextFunction) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});


userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.token = token;
  await user.save();

  return token;
};

userSchema.methods.verifyEmail = async function (token: string): Promise<boolean> {
  const user = this;
  if (user.emailVerificationToken !== token) {
    return false;
  }
  user.emailVerificationToken = undefined;
  await user.save();
  return true;
};


userSchema.statics.findByCredentials = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('enter email is not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('password does not match');
  }

  return user;
};


userSchema.methods.logout = async function (token: string) {
  const user = this;
  user.tokens = undefined;
  await user.save();
};

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;