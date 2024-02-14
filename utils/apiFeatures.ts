import { Query } from 'express-serve-static-core';

export class APIFeatures {
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
