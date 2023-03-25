import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Input from "@/components/input";
import Link from "next/link";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginRedirect = ()=>{
        router.push('/');
    } 

    return(
        <div className="flex justify-center">
            <div className="bg-black px-10 py-10 self-center">
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
                <button onClick={loginRedirect} className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
                    Login
                </button>
                <p className="text-neutral-500 mt-5">
                    First time using Fixer?
                    <Link href="/register" className="text-white ml-1 hover:underline cursor-pointer">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;