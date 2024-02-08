import express, { Response, Request } from 'express';
// import * as fs from 'fs';
import * as url from 'url';
import tourModel from './../models/tourModel';

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
export const getAllTours = (req: express.Request, res: express.Response) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: `success`,
    // requestedAt: req.requestTime,
    // count: tours.length,
    // data: { tours: tours },
  });
};
export const getTour = (req: express.Request, res: express.Response) => {
  // console.log(req.params);
  // const id = parseInt(req.params.id, 10);
  // const tour = tours.find((t: typeof tours) => t.id === id);
  res.status(200).json({
    status: `success`,
    // data: { tour },
    // count : tours.length,
    // data : {tours : tours }
  });
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
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};
export const deleteTour = (req: express.Request, res: express.Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
