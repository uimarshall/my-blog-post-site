import { type Document, type Types } from 'mongoose';
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  profile: string;
  profilePhoto: string;
  posts: string[];
  postCount: number;
  about: string;
  isBlocked: boolean;
  isAdmin: boolean;
  role: string;
  viewedBy: Types.ObjectId;
  followers: Types.ObjectId;
  following: Types.ObjectId;
  active: boolean;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  getJwtToken: () => string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
}
