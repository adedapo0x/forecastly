export class AppError extends Error{
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ){
        // used to instantiate the parent class Error with its message, super() required when doing inheritance
        super(message); 

        // fixes inheritance issues when extending builtin JS classes like Error by manually setting the prototype chain correctly
        // so now our an instance of AppError (eg myError) points to AppError.prototype and not Error.prototype
        // This ensures our instanceof works properly and all prototype methods are accessible
        // so now, myError -> AppError.prototype -> Error.prototype -> Object.prototype
        Object.setPrototypeOf(this, AppError.prototype); 


        // attaches the error stack trace to this(my error instance) and omits all unnecessary things in the call stack
        Error.captureStackTrace(this, this.constructor);
    }
}

