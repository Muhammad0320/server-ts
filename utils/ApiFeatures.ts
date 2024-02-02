import { Query, Document } from "mongoose";

interface ApiFeaturesTypes<T extends Document> {
  query: Query<T[], T>;
  queryString: { [key: string]: string };
}

class ApiFeatures<K extends Document> implements ApiFeaturesTypes<K> {
  constructor(
    public query: Query<K[], K>,
    public queryString: { [key: string]: string }
  ) {}

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["fields", "limit", "page", "sort"];

    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering

    let queryStr = JSON.stringify(queryObj).replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replaceAll(",", " ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replaceAll(",", " ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const limit: number = +this.queryString.limit || 10;

    const page: number = +this.queryString.page || 1;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
