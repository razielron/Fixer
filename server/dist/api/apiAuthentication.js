var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CognitoTokenValidator from "../services/cognitoTokenValidator.js";
export function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).send("Authorization header missing");
        }
        const [bearer, userToken] = authorizationHeader.split(" ");
        if (bearer !== "Bearer" || !userToken) {
            return res.status(401).send("Invalid authorization header");
        }
        const userPayload = yield CognitoTokenValidator.validate(userToken);
        console.log({ userToken });
        if (!userPayload) {
            return res.status(401).send("Invalid user token");
        }
        req.body.cognitoUser = {
            id: userPayload.sub,
            email: userPayload.email,
            scope: userPayload.scope,
        };
        console.log({ cognitoUser: req.body.cognitoUser });
        next();
    });
}
//# sourceMappingURL=apiAuthentication.js.map