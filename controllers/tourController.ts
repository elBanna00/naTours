import express, { Response, Request, NextFunction, query } from 'express';
// import * as fs from 'fs';
import * as url from 'url';
import tourModel from './../models/tourModel';
import { Query } from 'express-serve-static-core';

// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString(),
// );
// export const checkID = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   val: typeof tours.id,
// ) => {
//   console.log(typeof tours.id);
//   if (parseInt(req.params.id, 10) > tours.length) {
//     return res.status(404).json({ status: 'fail' });
//   }
//   next();
// };

// export const checkBody = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       Status: 'Fail',
//       message: 'Missing data ',
//     });
//   }
//   next();
// };
const queryType = typeof tourModel.find();
export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};
class APIFeatures {
  query: any;
  queryString: Query;

  constructor(query: any, queryString: Query) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const filteredQuery = { ...this.queryString };
    const exculdedQueries = ['page', 'sort', 'limit', 'fields'];
    exculdedQueries.forEach((el) => delete filteredQuery[el]);

    let strQuery = JSON.stringify(filteredQuery);
    strQuery = strQuery.replace(/\b(gte|gt|lte|lt)\b/g, (el) => `$${el}`);
    this.query = this.query.find(JSON.parse(strQuery));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = String(this.queryString.sort).split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = String(this.queryString.fields).split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skips = (page - 1) * limit;

    this.query = this.query.skip(skips).limit(limit);
    return this;
  }
}
export const getAllTours = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const features = new APIFeatures(tourModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: `success`,
      count: tours.length,
      data: { tours },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
export const getTour = async (req: express.Request, res: express.Response) => {
  try {
    const tour = await tourModel.findById(req.params.id);
    res.status(200).json({
      status: `success`,

      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
export const createTour = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const newTour = await tourModel.create(req.body);
    res.status(201).json({ status: 'Success', data: { tours: newTour } });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
  res.send('done');
};
export const updateTour = (req: express.Request, res: express.Response) => {
  try {
    const tour = tourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
export const deleteTour = (req: express.Request, res: express.Response) => {
  try {
    tourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
