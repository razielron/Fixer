import { useRouter } from "next/router";
import { useState } from "react";
import Input from "@/components/input";
import Link from "next/link";
import UserPool from "@/pages/api/userPool";
import { UserModel } from "@/src/models/userModel";
import { Role } from "@/src/enums/role";
import DropDown from "@/components/DropDown";
import { District, districtOptions } from "@/src/enums/district";

const Register = () => {
    const options = [
        { 
            value: 1,
            label: "BASIC"
        },
        {
            value:  2,
            label: "PROFESSIONAL"
        }
    ];
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [district, setDistrict] = useState('');
    const [error, setError] = useState('');
    
    const signupRedirectVladition = async () => {
    
        let newError = '';
        if(firstName === '' || lastName === '' || email === ''||password === '' || confirmPassword === ''){
            newError = (`Please fill all fields`);
        }

        setError(newError);

        if (!newError) {
            await signupRedirect();
        }

    };

    function toEnumValue(displayName: string): string { 
        return displayName 
            .split(' ')  // Split by space 
            .map(word => word.toUpperCase())  // Convert each word to uppercase 
            .join('_');  // Join words with an underscore 
    }
    
    const userPoolErrorTranslation = (error:string) => {
        let err = ''
        if(error.includes('Username should be an email'))
            err = 'Please enter valid Email'

        else if(error.includes('Password did not conform with policy: Password not long enough'))
            err = 'Please enter password with 6 charcters at least'
        
        else
            err = error
            
        return err;
    }

    const signupRedirect = async () => {
        UserPool?.signUp(email, password, [], [], async (err, data) => {
            if(err) {
                setError(userPoolErrorTranslation(err.toString()));
                return;
            }
            const user : UserModel = {
                email: email,
                name: `${firstName} ${lastName}`,
                firstName: firstName,
                lastName: lastName,
                address:district,
                role: Role.BASIC   
            };

            let response = await fetch('/api/user', {method: 'POST', body: JSON.stringify(user)});
            router.push('/login');
        });
    };

    const checkPasswordValidation= (event:any) => {
        setConfirmPassword(event.target.value)

        if(password !== event.target.value) {
            setError("Password do not match")
        }
        else setError("")
    }



    return(
        <div className="reative min-h-screen h-full w-full bg-[url('/images/peakpx.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="min-h-screen flex justify-center">
            <div className="bg-black bg-opacity-60 px-10 py-10 items-center">
                <nav className="">
                    <img src="/images/fixerLogo.png" alt="Logo" className="h-5 rounded-md mb-5"></img>
                </nav>
                <h2 className="text-white mb-2 py-2">
                    Register as a Member
                </h2>
                <div className="flex flex-col gap-4">
                    <Input
                        onChange = {(event:any)=> setFirstName(event.target.value)}
                        id = "firstName"
                        type = "text"
                        value = {firstName}
                        placeHolder = "First name"
                    />
                    <Input
                        onChange = {(event:any)=> setLastName(event.target.value)}
                        id = "last name"
                        type = "text"
                        value = {lastName}
                        placeHolder = "Last name"
                    />
                    <DropDown  
                        options={districtOptions}
                        onChange={(event:any)=> setDistrict(toEnumValue(event[0].label))}
                        placeHolder="District"   
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
                    <Input
                        onChange = {(event:any)=> checkPasswordValidation(event)}
                        id = "confirmPassword"
                        type = "password"
                        value = {confirmPassword}
                        placeHolder = "Confirm password"
                        
                    /> 
                </div>
                <div>
                    <p className="text-red-600 mt-5">{error}</p>
                </div>
                <button onClick={signupRedirectVladition} className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
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

export default Register;