import { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";
import axios from "axios"

// Development error response
const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: "error",
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Production error response
const sendErrorProd = (err: AppError, res: Response) => {
    // operational ie trusted or known error, send message to client
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: "error",
            message: err.message
        });
    } else {
        // unknown error, do not send err.message, ie don't leak error details
        console.log("Unexpected error encountered, ", err);
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred"
        })
    }
};


// Here is where you define helper methods that modifies the possibke errors from your data layer to be user friendly before it gets sent to the client
// Eg Mongoose, Prisma, Zod, Postgres or MySQL themselves etc


// global error handler
export const globalErrorHandler = (
    err: any,
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    let error: AppError;
    
    // Here we kind of check if it is an operational error that we don't necessarily throw then modify the error into AppError format
    // These errors could be from a validation issue, authentication issue. they can be from Zod, Prisma and the likes
    // we don't throw the errors ourselves but it is an operational error and we want the client to know the reason for the error
    // So these if else statements to cover all possible such errors that can be gotten from here then modify into an AppError


    if (err instanceof AppError){ // if this was an explicitly typed Exception that was thrown  
        error = err
    } else if (axios.isAxiosError(err)){
        console.log(err)
        error = new AppError(500, "Error occured while getting forecast", false);
    } else{
        console.log(err)
        error = new AppError(500, "An unexpected error occurred. Please try again later", false)
    }

    if (process.env.NODE_ENV === "development"){
        sendErrorDev(err, res);
    } else {
        sendErrorProd(error, res);
    }
}

