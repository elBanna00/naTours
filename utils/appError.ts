import mongoose from 'mongoose';

export class AppError extends mongoose.Error.ValidationError {
  status: string;
  statusCode: number;
  isOperational: boolean;
  path: string;
  errmsg: string;
  constructor(message: string, statusCode: number) {
    super(message);

    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}
