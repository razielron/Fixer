import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { userRoute } from './userRoute.js';
import { postRoute } from './postRoute.js';

dotenv.config();

const app: Express = express();
const PORT : number = parseInt(process.env.SERVER_PORT || "5000");

function setContentType(req : Request, res : Response, next : NextFunction) : void {
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next();
}

app.use(setContentType);
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.get('/healtcheck', (req: Request, res: Response) : void => {
    res.send('Healthy');
});

app.use('/user', userRoute);
app.use('/post', postRoute);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running on port: ${PORT}`);
});