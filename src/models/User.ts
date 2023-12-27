import { model, Schema, Document } from 'mongoose';
import crypto from 'crypto';



export interface UserDocument extends Document {
  name: string;
  password: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  getResetPasswordToken: () => string;
  createdAt: Date;
  phoneNumber: string;
}

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) =>
        /\S+@\S+\.\S+/.test(value),
      message: 'Invalid email format',
    },
  },
  resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpire: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: { 
    type: String,
    required: true,
  },
});


// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expiration
    this.resetPasswordExpire =
      Date.now() + 24 * 60 * 60 * 1000;
  
    return resetToken;
  };

export const User = model<UserDocument>('User', UserSchema);
