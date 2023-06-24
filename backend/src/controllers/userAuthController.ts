/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';

// import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import User, { type UserDocument } from '../models/user';
import { type NextFunction, type Request, type Response } from 'express';
import ErrorHandler from '../utils/errorHandler';
import generateToken from '../utils/generateToken';

// @desc Register a new user
// @route POST /api/v1/users/register
// @access Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;

  // console.log(process.env.CLIENT_URL);
  // console.log(nanoid());

  const username: string = nanoid();
  const profile = `${process.env.CLIENT_URL}/profile/${username}`;
  // console.log(profile);

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    username,
    profile,
    password,
    profilePhoto: {
      public_id: 'avatars/h2yrh8qucvejk139t8ro',
      url: 'https://res.cloudinary.com/uimarshall/image/upload/v1625707364/avatars/h2yrh8qucvejk139t8ro.jpg',
    },
  });

  generateToken(newUser, 201, res);
});

// @desc: Login a user
// @route: /api/v1/users/login
// @access: protected

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  // Check if email and password is entered in by user
  if (!email || !password) {
    next(new ErrorHandler('Please enter email and password', 400));
    return;
  }

  // Find user in database
  const userFound = await User.findOne({ email }).select('+password');
  if (userFound == null) {
    next(new ErrorHandler('Invalid email or password', 401));
    return;
  }

  // Check if password is correct or not
  const isPasswordMatched = await userFound.comparePassword(password);
  if (!isPasswordMatched) {
    next(new ErrorHandler('Invalid email or password', 401));
    return;
  }

  generateToken(userFound, 200, res);
});

export { registerUser, loginUser };
