import { NextFunction, Request, Response } from "express";

type ExpressHandlerType = (
    req: Request,
    res: Response,
    next?: NextFunction
) => Promise<any> | void

export const expressHandler = (fn: ExpressHandlerType) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };



    