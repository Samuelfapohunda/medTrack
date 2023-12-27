import { statusCode } from './../statusCodes';
import { NextFunction, Request, Response } from 'express';
import { createHash } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/async';
import sendEmail from '../utils/sendMail';


export const logoutUser = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const userId = req.user?._id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return next(
          new ErrorResponse(
            'User not found',
            statusCode.notFound
          )
        );
      }
  
      res.setHeader('Authorization', '');
  
      return res.status(statusCode.success).json({
        success: true,
        message: 'User logged out successfully',
      });
    }
  );
  

export const registerPatient = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const {
        name,
        email,
        password,
      } = req.body;
  
      if (password.length < 6) {
        return next(
          new ErrorResponse(
            'Password must be at least 6 characters long',
            statusCode.badRequest
          )
        );
      }
  
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(
          new ErrorResponse(
            'User with this email already exists',
            statusCode.badRequest
          )
        );
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser: Partial<UserDocument> = {
        name,
        email,
        password: hashedPassword
      };
  
      const createdUser = await User.create(
        newUser as UserDocument
      );
  
      return res.status(statusCode.created).json({
        success: true,
        message: 'User registered successfully',
        user: createdUser,
      });
    }
  );



  export const loginUser = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return next(
          new ErrorResponse(
            'Invalid credentials',
            statusCode.unauthorized
          )
        );
      }
  
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
  
      if (!isPasswordValid) {
        return next(
          new ErrorResponse(
            'Invalid credentials',
            statusCode.unauthorized
          )
        );
      }
  
      const secretKey = process.env.SECRET_KEY as string;
  
      const tokenPayload = {
        userId: existingUser._id
      };
  
      const token = jwt.sign(tokenPayload, secretKey, {
        expiresIn: '7d',
      });
  
      return res
        .status(statusCode.success)
        .header('Authorization', `Bearer ${token}`)
        .json({
          success: true,
          message: 'User logged in successfully',
          user: existingUser,
          token: token,
        });
    }
  );


  export const forgotPassword = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const user = await User.findOne({
        email: req.body.email,
      });
  
      if (!user) {
        return next(
          new ErrorResponse(
            'User not found',
            statusCode.notFound
          )
        );
      }
  
      const resetToken = user?.getResetPasswordToken();
  
      await user?.save({ validateBeforeSave: false });
  
      const resetUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/auth/reset-password/${resetToken}`;
  
      const message = `Dear ${user.name},\n\nYou are receiving this email because a request has been made to reset your password. If you did not initiate this request, please disregard this message.\n\nTo reset your password, please click on the link below:\n\n[Reset Password Link]: ${resetUrl}\n\nThis link will expire in ${user.resetPasswordExpire}, so be sure to complete the password reset process promptly.\n\nThank you for using our service.\n\nBest regards,\nMedTrack`;
  
      await sendEmail({
        email: user?.email,
        subject: 'Password Reset Token',
        message,
      });
  
      res
        .status(statusCode.success)
        .json({ success: true, data: 'Email sent!' });
  
      user.resetPasswordToken = '';
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
    }
  );


  export const resetPassword = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const resetPasswordToken = createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
  
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return next(
          new ErrorResponse(
            'Invalid or expired token',
            statusCode.badRequest
          )
        );
      }
  
      const newResetPassword = req.body.password;
  
      if (req.body.password.length < 6) {
        return next(
          new ErrorResponse(
            'Password must be at least 6 characters long',
            statusCode.badRequest
          )
        );
      }
  
      const hashedResetPassword = await bcrypt.hash(
        newResetPassword,
        10
      );
  
      user.password = hashedResetPassword;
      user.resetPasswordToken = '';
      user.resetPasswordExpire = undefined;
      await user.save();
  
      res.status(statusCode.success).json({
        success: true,
        data: 'Password reset successful',
      });
    }
  );
  
  