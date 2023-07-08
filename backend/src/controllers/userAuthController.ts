/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';
import User from '../models/user';
import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ErrorHandler from '../utils/errorHandler';
import generateToken from '../utils/generateToken';
import logger from '../../logger/logger';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';

export interface INewUser {
  firstname: string;
  lastname: string;
  email: string;
  profile: string;
}

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

// @desc: Logout a user
// @route: /api/v1/users/logout
// @access: protected

const logoutUser = asyncHandler(async (req, res, next) => {
  // To logout is to clear the cookie stored during login/sign up,
  // hence set token to 'null' and expires it immediately with Date.now() to remove it from the session
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc: Forgot Password
// @route: /api/v1/users/password/forgot
// @access: protected

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userFound = await User.findOne({ email });
  if (userFound == null) {
    next(new ErrorHandler(`User with this email: ${email} not found`, 404));
    return;
  }
  // Get reset token
  const resetToken = userFound.getResetPasswordToken();

  // save the token to the user

  await userFound.save({ validateBeforeSave: false });

  // Create reset password url
  // req.protocol=https or http
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/password/reset/${resetToken}`;

  // const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // Message to user
  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it!`;

  try {
    await sendEmail({
      email: userFound.email,
      subject: 'Quint Password Recovery',
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${userFound.email}`,
    });
  } catch (error) {
    userFound.resetPasswordToken = undefined;
    userFound.resetPasswordExpire = undefined;
    // We cannot save to db if error
    await userFound.save({ validateBeforeSave: false });
    if (error instanceof Error) {
      // ✅ TypeScript knows err is Error
      next(new ErrorHandler(error.message, 500));
    } else {
      logger.error('Unexpected error', error);
    }
  }
});

// @desc: Password Reset
// @route: /api/v1/users/password/reset/:token
// @access: protected

const resetPassword = asyncHandler(async (req, res, next): Promise<void> => {
  // Hash url token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  // Compare the hashed token to the one stored in the Db
  const userFound = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!userFound) {
    next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    return;
  }

  if (req.body.password !== req.body.confirmPassword) {
    next(new ErrorHandler('Password does not match!', 400));
    return;
  }

  //  If user found - Setup new password
  userFound.password = req.body.password;
  // Destroy the token by setting it to undefined
  userFound.resetPasswordToken = undefined;
  userFound.resetPasswordExpire = undefined;

  await userFound.save();

  // Send token again
  generateToken(userFound, 200, res);
});

// @desc: Get currently logged in user details
// @route: /api/v1/users/me
// @access: protected

/* TODO: OMIT THE TYPE ANNOTATION FOR THE req object will throw an error in the 'req.user.id'- Write an article on this on how to solve the error by simply passing the type annotation to the req object as 'Request'. */

const getUserProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.user);
  const userFound = await User.findById(req.user.id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: userFound,
  });
});

// @desc: Update password
// @route: /api/v1/users/password/update
// @access: protected

const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userFound: any = await User.findById(req.user.id).select('+password');
  // Check previous user password
  const isMatch = await userFound.comparePassword(req.body.oldPassword);
  if (!isMatch) {
    next(new ErrorHandler('Old Password is incorrect', 400));
    return;
  }
  // Set the new password to what is coming from the req body.
  userFound.password = req.body.password;
  await userFound.save();

  generateToken(userFound, 200, res);
});

// @desc: Update user profile/user-details
// @route: /api/v1/users/me/update
// @access: protected

const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { firstname, email, lastname, profile } = req.body;

  const newUserData = { firstname, email, lastname, profile };

  // Update profile photo: TODO

  const userFound = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: userFound,
  });
});

// test user protected routes

const protectedUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.json({ data: 'I am authenticated' });
});

export {
  registerUser,
  loginUser,
  protectedUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
};
