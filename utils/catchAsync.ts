import express, { NextFunction } from 'express';
import { AppError } from './appError';

export const catchAsync = (fn: Function) => {
  const func: any = (req: Request, res: Response, next: NextFunction): any => {
    fn(req, res, next).catch((err: AppError) => next(err));
  };
  return func;
};
