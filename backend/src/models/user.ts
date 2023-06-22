import { Schema, model, type Document, type Types } from 'mongoose';

import validator from 'validator';
import bcrypt from 'bcryptjs';

// No need to define TS interface any more. InferSchemaType will determine the type as follows:
export interface UserDocument extends Document {
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
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please enter your First name'],
      trim: true,
      lowercase: true,
      maxlength: [32, 'Your First name must not exceed 32 characters'],
    },
    lastname: {
      type: String,
      required: [true, 'Please enter your Last name'],
      trim: true,
      lowercase: true,
      maxlength: [32, 'Your Last name must not exceed 32 characters'],
    },
    username: {
      type: String,
      required: [true, 'Please enter your First name'],
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
      maxlength: [32, 'Your First name must not exceed 32 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [6, 'Your password must be at least 6 characters'],
      select: false, // Don't display the password along the user info
    },
    profile: {
      type: String,
      required: [true, 'Please enter your profile'],
    },

    // Store profile photo info in cloudinary
    profilePhoto: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    posts: [
      {
        type: [Schema.Types.ObjectId],
        ref: 'Post',
      },
    ],
    postCount: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
    },

    isBlocked: {
      // This field will be used for content moderation to prevent the user from posting unauthorized content.
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Editor'],
    },
    viewedBy: [
      {
        type: [Schema.Types.ObjectId],
        ref: 'User',
      },
    ],
    followers: [
      {
        type: [Schema.Types.ObjectId],
        ref: 'User',
      },
    ],
    following: [
      {
        type: [Schema.Types.ObjectId],
        ref: 'User',
      },
    ],
    active: {
      // we can use it to encourage users to be active and write more posts, state how many people have read or liked posts using web scraping to encourage them.
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving user to database
userSchema.pre('save', async function (this: UserDocument, next) {
  // Check if password is modified
  if (!this.isModified('password')) {
    next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

// Compare user password
userSchema.methods.comparePassword = async function (currEnteredPassword: string): Promise<boolean> {
  const passwordMatch = await bcrypt.compare(currEnteredPassword, this.password);
  return passwordMatch;
};

// type User = InferSchemaType<typeof userSchema>;
// export default model<User>('User', userSchema);
const User = model<UserDocument>('User', userSchema);

export default User;
