import { RequestHandler, Request, Response, NextFunction } from "express";

const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): RequestHandler => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
