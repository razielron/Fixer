import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import Input from "@/components/input";
import Link from "next/link";
import UserPool from "@/pages/api/userPool";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { ApiResponseModel } from "@/src/models/apiModel";
import { UserModel } from "@/src/models/userModel";
import { json } from "stream/consumers";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const saveUserInformation = async (apiToken: string) => {
        const headers = {Authorization: `Bearer ${apiToken}`};
        let params = new URLSearchParams({email});
        let response = await fetch(`/api/user?${params}`, {headers});
        let resJson: {data: UserModel} = await response.json();
        let user: UserModel = resJson?.data;

        await saveAvatarToLocalstorage(user);
        setCookie('userInformation', user);
    }

    let saveAvatarToLocalstorage = async (user: UserModel) => {
        if(!user?.photoUrl) {
            return;
        }
    
        let response = await fetch(user?.photoUrl);
        let imageBlob = await response.blob();

        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = function() {
            const base64String = (reader.result as string).split(',')[1];
            localStorage.setItem('userAvatar', base64String);
        };
    }

    const loginRedirect = () => {
        if(!UserPool) return;

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });
        
        user.authenticateUser(authDetails, {
            onSuccess: data => {
                const authToken = data.getIdToken().getJwtToken();
                setCookie('jwt_auth', authToken);
                saveUserInformation(authToken);
                router.push('/issues');
            },

            onFailure: err => setError(err.toString()),
            newPasswordRequired: data => console.log("newPasswordRequired", {data})
        });
    }

    return(
    <div className="reative min-h-screen h-full w-full bg-[url('/images/peakpx.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="min-h-screen flex justify-center">
            <div className="bg-black bg-opacity-60 px-10 py-10 self-center">
                <nav className="">
                    <img src="/images/fixerLogo.png" alt="Logo" className="h-5 rounded-md mb-5"></img>
                </nav>
                <h2 className="text-white mb-2 py-2">
                    Sign in
                </h2>
                <div className="flex flex-col gap-4">
                    <Input
                        onChange = {(event:any)=> setEmail(event.target.value)}
                        id = "email"
                        type = "email"
                        value = {email}
                        placeHolder = "Email"
                    />
                    <Input
                        onChange = {(event:any)=> setPassword(event.target.value)}
                        id = "password"
                        type = "password"
                        value = {password}
                        placeHolder = "Password"
                    />
                </div>
                <div>
                    <p className="text-red-600 mt-5">{error}</p>
                </div>
                <button onClick={loginRedirect} type="submit" className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
                    Login
                </button>
                <p className="text-neutral-400 mt-5">
                    First time using Fixer?
                    <Link href="/register" className="text-white ml-1 hover:underline cursor-pointer">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    </div>
    )
}

export default Login;