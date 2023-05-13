import util from 'util';
import { CognitoUser, AuthenticationDetails, CognitoUserPool,
    ICognitoUserPoolData, ISignUpResult } from "amazon-cognito-identity-js";

class UserPoolClient {
    private static instance: UserPoolClient;
    private userPool: CognitoUserPool | null;
    private signupPromise;

    private constructor() {
        const poolData : ICognitoUserPoolData = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
            ClientId: process.env.COGNITO_CLIENT_ID || "",
        };
        console.log({poolData});
        try {
            this.userPool = new CognitoUserPool(poolData);
            this.signupPromise = util.promisify(this.userPool.signUp);
        } catch {
            console.error("cognitoUserPool is null");
            this.userPool = null;
        }
    }

    public static getInstance(): UserPoolClient {
        if (!UserPoolClient.instance) {
            UserPoolClient.instance = new UserPoolClient();
        }

        return UserPoolClient.instance;
    }

    public async signup(email: string, password: string) : Promise<ISignUpResult | undefined> {
        try {
            if (!this.userPool || !this.signupPromise) {
                return undefined;
            }

            let signupResult = await this.signupPromise(email, password, [], []);

            if(signupResult) {
                return signupResult;
            }
        }
        catch (error) {
            console.error({error});
            return undefined;
        }
    }

    public async signin(email: string, password: string) {
        try {
            if (!this.userPool) {
                return undefined;
            }

            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password
            });
            const user = new CognitoUser({
                Username: email,
                Pool: this.userPool
            });

            let signinPromise = util.promisify(user.authenticateUser);

            //let signupResult = await signinPromise(authDetails);
        }
        catch (error) {
            console.error({error});
            return undefined;
        }
    }
}