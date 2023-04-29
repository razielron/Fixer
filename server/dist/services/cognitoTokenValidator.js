var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from 'path';
import dotenv from 'dotenv';
import { CognitoJwtVerifier } from "aws-jwt-verify";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
class CognitoTokenValidator {
    constructor() {
        this.verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_USER_POOL_ID || "",
            tokenUse: "id",
            clientId: process.env.COGNITO_CLIENT_ID || "",
        });
    }
    static getInstance() {
        if (!CognitoTokenValidator.instance) {
            CognitoTokenValidator.instance = new CognitoTokenValidator();
        }
        return CognitoTokenValidator.instance;
    }
    validate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield this.verifier.verify(token);
                console.log("Token is valid. Payload:", payload);
                return payload;
            }
            catch (_a) {
                console.log("Token not valid!");
                return null;
            }
        });
    }
}
export default CognitoTokenValidator.getInstance();
//# sourceMappingURL=cognitoTokenValidator.js.map