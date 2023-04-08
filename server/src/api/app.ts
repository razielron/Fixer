import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { userRoute } from './userRoute.js';
import { postRoute } from './postRoute.js';
import { authenticateUser } from "./apiAuthentication.js";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

const app: Express = express();
const PORT : number = parseInt(process.env.SERVER_PORT || "5000");

function setContentType(req : Request, res : Response, next : NextFunction) : void {
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next();
}

app.use(cors());
app.options('*', cors());
app.use(setContentType);
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.get('/healtcheck', (req: Request, res: Response) : void => {
    console.log('Healthy');
    res.send('Healthy');
});

app.get('/userTokenCheck', authenticateUser, (req: Request, res: Response) : void => {
    console.log('Healthy');
    res.send('Healthy');
});

app.use('/user', userRoute);
app.use('/post', postRoute);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running on port: ${PORT}`);
});