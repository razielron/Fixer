import { CognitoUserPool, ICognitoUserPoolData } from "amazon-cognito-identity-js";

const poolData : ICognitoUserPoolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
    ClientId: process.env.COGNITO_CLIENT_ID || "",
};
console.log({poolData});
let cognitoUserPool : CognitoUserPool | null;

try {
    cognitoUserPool = new CognitoUserPool(poolData);
} catch {
    console.error("cognitoUserPool is null");
    cognitoUserPool = null;
}

export default cognitoUserPool;