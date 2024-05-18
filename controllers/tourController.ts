import express, { Response, Request, NextFunction, query } from 'express';
import { APIFeatures } from 'utils/apiFeatures';
// import * as fs from 'fs';
import * as url from 'url';
import tourModel from './../models/tourModel';
import { AppError } from 'utils/appError';
import { catchAsync } from 'utils/catchAsync';

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

export const getAllTours = catchAsync(
  async (req: express.Request, res: express.Response) => {
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
  },
);
export const getTour = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const tour = await tourModel.findById(req.params.id);
    res.status(200).json({
      status: `success`,

      data: tour,
    });
  },
);

export const createTour = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const newTour = await tourModel.create(req.body);
    if (!newTour) {
      next(new AppError('There is no Docuemnt with the given ID ', 404));
    }
    res.status(201).json({
      status: 'Success',
      data: { tours: newTour },
    });
  },
);
export const updateTour = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const tour = tourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      next(new AppError('There is no Docuemnt with the given ID ', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  },
);
export const deleteTour = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const tour = tourModel.findByIdAndDelete(req.params.id);
    if (!tour) {
      next(new AppError('There is no Docuemnt with the given ID ', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await tourModel.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        count: { $sum: 1 },
        ratingsCount: { $sum: '$ratingsQuantity' },
        averageRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response) => {
    const year = parseInt(req.params.year);
    const plan = await tourModel.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          tourCount: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: `$_id` },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { tourCount: -1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  },
);
