import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import { AppError } from 'utils/appError.js';
import morgan from 'morgan';
// @ts-ignore
import userRouter from './routes/userRouter.ts';
// @ts-ignore
import tourRouter from './routes/tourRouter.ts';
import log from 'utils/logger.js';
import { globalErrorHandler } from 'utils/errorHandlers.js';

export const app = express();

// interface ResponseError extends Error {
//   status?: string;
//   statusCode?: number;
// }
/**
 * MiddleWares
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`./public`));
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Hello from Middleware');
    next();
  },
);
// app.use((req, res, next) => {
//   // req.requestTime = new Date().toISOString();
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't reach ${req.originalUrl} on this Server`, 404));
});

app.use(globalErrorHandler);
