import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import Redis from "ioredis"
import axios from "axios"
import { globalErrorHandler } from "./utils/error.middleware";
import { AppError } from "./utils/appError";
import { expressHandler } from "./utils/expressErrorHandler";
import { urlValidationSchema, UrlValidatorType } from "./schema/urlValidator.schema";

dotenv.config();

const app = express();

app.use(express.json())

// Handling redis config, should be in a file of its own for larger applications
let redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
    maxRetriesPerRequest: 3
})  

redisClient.on('connect', () => console.log("Connected to Redis"));
redisClient.on('error', (err) => console.error("Redis connection error: ", err));
redisClient.on("ready", ()=>  console.log("Redis is ready to use"));



const generateUrl = (obj: UrlValidatorType) => {
    const baseUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${obj.location}`;
    let body = "";
    if (obj.date1) body += `/${obj.date1}`;

    if (!obj.date1 && obj.date2){
        throw new AppError(400, "Date 2 cannot be passed without date 1");
    }

    if (obj.date2) body += `/${obj?.date2}`;
    const url = baseUrl + body + `/?key=${process.env.API_KEY}`;
    return url;
};

const fetchWeatherInfo = async (obj: UrlValidatorType) => {
    const url = generateUrl(obj);
    const response = await axios.get(url);
    return response.data;
}

app.get('/get-weather', expressHandler(async (req: Request, res: Response) => {
    const result = urlValidationSchema.parse(req.query);

    const weatherForecast = await fetchWeatherInfo(result);
    res.json(weatherForecast);

}))

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next);
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})

