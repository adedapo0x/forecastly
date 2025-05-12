import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import axios from "axios"
import { globalErrorHandler } from "./utils/error.middleware";

dotenv.config();

const app = express();

app.use(express.json())

interface UrlValidator {
    location: string,
    date1 ?: Date,
    date2 ?: Date
}

const generateUrl = (obj: UrlValidator) => `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${obj.location}/${obj?.date1}/${obj?.date2}?key=${process.env.API_KEY}`;

const fetchWeatherInfo = async (obj: UrlValidator) => {
    const url = generateUrl(obj);
    const response = await axios.get(url);
    return response
}

app.get('/get-weather', async (req: Request, res: Response) => {
    const query = req.query;
    if (!query.location){
        throw new Error("")
    }
    // await fetchWeatherInfo(query);

})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next);
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})

