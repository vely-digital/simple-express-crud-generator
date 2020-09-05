import { Request } from "express";

export interface CustomRequest extends Request {
  body?: object;
}
