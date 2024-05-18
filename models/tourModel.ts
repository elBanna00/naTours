import mongoose from 'mongoose';
import slugify from 'slugify';
interface userDocument extends mongoose.Document {
  name: string;
  slug?: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price?: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  createdAt?: Date;
  startDates?: Date[];
}
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxLength: [40, 'A tour name must be less than or equal 40 characters'],
      minLength: [10, 'A tour name must be less than or equal 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration '],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a Difficutly'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A tour must be either easy , medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: number) {
          return val < this.price;
        },
        message: 'The discound must be lower than the regular price ',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a Cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre<userDocument>('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
