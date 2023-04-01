import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Input from "@/components/input";
import Link from "next/link";
import UserPool from "@/pages/api/userPool";
import { userClient } from "@/pages/api/userClient";
import { UserModel } from "@/src/models/userModel";
import { Role } from "@/src/enums/role";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const signupRedirect = async () => {
        UserPool?.signUp(email, password, [], [], async (err, data) => {
            if(err) {
                setError(err.toString());
                return;
            }

            const user : UserModel = {
                email: email,
                name: name,
                role: Role.BASIC    
            };
            await userClient.createUser(user);
            router.push('/');
        });
    };

    return(
        <div className="reative min-h-screen h-full w-full bg-[url('/images/peakpx.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="min-h-screen flex justify-center">
            <div className="bg-black bg-opacity-60 px-10 py-10 self-center">
                <nav className="">
                    <img src="/images/fixerLogo.png" alt="Logo" className="h-5 rounded-md mb-5"></img>
                </nav>
                <h2 className="text-white mb-2 py-2">
                    register
                </h2>
                <div className="flex flex-col gap-4">
                    <Input
                        onChange = {(event:any)=> setName(event.target.value)}
                        id = "name"
                        type = "name"
                        value = {name}
                        placeHolder = "Name"
                    />
                    <Input
                        onChange = {(event:any)=> setRole(event.target.value)}
                        id = "role"
                        type = "role"
                        value = {role}
                        placeHolder = "Role"
                    />
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
                <button onClick={signupRedirect} className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
                    Sign up
                </button>
                <p className="text-neutral-400 mt-5">
                    Already have an account?
                    <Link href="/login" className="text-white ml-1 hover:underline cursor-pointer">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    </div>
    )
}

export default Login;