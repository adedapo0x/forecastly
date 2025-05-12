import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import axios from "axios"
import { globalErrorHandler } from "./utils/error.middleware";
import { AppError } from "./utils/appError";
import { asyncHandler } from "./utils/asyncHandler";
import { urlValidationSchema, UrlValidatorType } from "./schema/urlValidator.schema";

dotenv.config();

const app = express();

app.use(express.json())

const generateUrl = (obj: UrlValidatorType) => `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${obj.location}/${obj?.date1}/${obj?.date2}?key=${process.env.API_KEY}`;

const fetchWeatherInfo = async (obj: UrlValidatorType) => {
    const url = generateUrl(obj);
    const response = await axios.get(url);
    return response.data;
}

app.get('/get-weather', asyncHandler(async (req: Request, res: Response) => {
    const result = urlValidationSchema.safeParse(req.query);

    if (!result.success){
        const errMessages = result.error.errors.map(e => e.message).join(". ");
        throw new AppError(400, `Invalid query parameters: ${errMessages}`);
    }

    const weatherForecast = await fetchWeatherInfo(result.data);
    res.json(weatherForecast);

}))

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next);
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})

