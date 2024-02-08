import express from 'express';

import morgan from 'morgan';
// @ts-ignore
import userRouter from './routes/userRouter.ts';
// @ts-ignore
import tourRouter from './routes/tourRouter.ts';

export const app = express();

/**
 * MiddleWares
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`./public`));
// app.use(
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.log('Hello from Middleware');
//     next();
//   },
// );
// app.use((req, res, next) => {
//   // req.requestTime = new Date().toISOString();
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
