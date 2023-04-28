import path from 'path';
import dotenv from 'dotenv';
import { CognitoJwtVerifier } from "aws-jwt-verify";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

class CognitoTokenValidator {
  private static instance: CognitoTokenValidator;
  private verifier: any;

  private constructor() {
    this.verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID || "",
        tokenUse: "id", // or access
        clientId: process.env.COGNITO_CLIENT_ID || "",
    });
  }

  public static getInstance(): CognitoTokenValidator {
    if (!CognitoTokenValidator.instance) {
      CognitoTokenValidator.instance = new CognitoTokenValidator();
    }
    return CognitoTokenValidator.instance;
  }

  public async validate(token: string): Promise<any> {
    try {
        const payload = await this.verifier.verify(token);
        console.log("Token is valid. Payload:", payload);
        return payload;
    } catch {
        console.log("Token not valid!");
        return null;
    }
  }
}

export default CognitoTokenValidator.getInstance();
