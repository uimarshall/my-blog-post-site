import { type Response } from 'express';

// Create and send token and save in the cookie.
const generateToken = (user: { getJwtToken: () => string }, statusCode: number, res: Response): void => {
  // Create Jwt token
  const token = user.getJwtToken();
  // Options for cookie

  // const options = {
  //   expires: new Date(((Date.now() as any) + process.env.COOKIE_EXPIRATION_TIME) * 24 * 60 * 60 * 1000),
  //   httpOnly: true, // This will make it inaccessible using Js code in frontend
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  // };

  // Return the token and the userInfo stored in the token/cookie.
  res
    .status(statusCode)
    .cookie('token', token, {
      // expires: new Date(((Date.now() as any) + process.env.COOKIE_EXPIRATION_TIME) * 24 * 60 * 60 * 1000), // expires is invalid
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true, // This will make it inaccessible using Js code in frontend
      secure: process.env.NODE_ENV === 'PRODUCTION',
      sameSite: 'strict',
    })
    .json({ success: true, token, user });
};

export default generateToken;
