import asyncHandler from 'express-async-handler';
// import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import User from '../models/user';
import { type Request, type Response } from 'express';

// import ErrorHandler from '../utils/errorHandler';

// @desc Register a new user
// @route POST /api/v1/users/register
// @access Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, username, profile, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists !== null) {
    res.status(400);
    throw new Error('User already exists');
  }

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

  res.status(201).json({
    success: true,
    data: newUser,
  });
});

export { registerUser };
