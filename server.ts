import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

// @ts-ignore
import { app } from './app';

/**
 * DB config and init
 */

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected ');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on post: ${port}`);
});
