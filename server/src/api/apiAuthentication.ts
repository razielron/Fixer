import { Request, Response, NextFunction } from "express";
import CognitoTokenValidator from "../cognito/cognitoTokenValidator.js";

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).send("Authorization header missing");
    }

    const [bearer, userToken] = authorizationHeader.split(" ");
    if (bearer !== "Bearer" || !userToken) {
        return res.status(401).send("Invalid authorization header");
    }

    const userPayload = await CognitoTokenValidator.validate(userToken);
    console.log({userToken});
    if (!userPayload) {
        return res.status(401).send("Invalid user token");
    }

    req.body.cognitoUser = {
        id: userPayload.sub,
        email: userPayload.email,
        scope: userPayload.scope,
    };

    console.log({cognitoUser: req.body.cognitoUser});

    next();
}
