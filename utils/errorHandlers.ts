import { AppError } from './appError';
import { ErrorRequestHandler, Request, Response } from 'express';
import log from './logger';
import { after } from 'node:test';

const handleCastErrors = (err: AppError) => {
  return new AppError(`Invalid ${err.path}`, 400);
};
const handleDuplicateErrors = (err: AppError) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(`Duplicate field Value ${value} `, 400);
};
const handleValidationErrors = (err: AppError) => {
  const error = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data ${error.join('. ')}`, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    log.error('err');
    res.status(500).json({
      status: 'error',
      message: 'Something wend wrong !',
    });
  }
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name == 'CastError') {
      error = handleCastErrors(error);
    } else if (error.code === 11000) {
      handleDuplicateErrors(error);
    } else if (error.code === 'ValidationError') {
      handleValidationErrors(error);
    }
    sendErrorProd(error, res);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
