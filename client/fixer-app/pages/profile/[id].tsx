import Profile from "@/components/Profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { getCookie, setCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import { UserModel } from "@/src/models/userModel";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
    const router = useRouter();
    const userId = router.query.id;
    const [userInformation, setUserInformation] = useState<UserModel>({}); 
    const [isLoading, setIsLoading] = useState(false);

    async function getUserInformation(token: string, id: string) {
        setIsLoading(true);
        const headers = {Authorization: `Bearer ${token}`};
        let params = new URLSearchParams({id});
        let response = await fetch(`/api/user?${params}`, {headers});
        let jsonRes = await response.json();
        setIsLoading(false);
        return jsonRes.data;
    }

    async function getAndSetUserInformation() {
        const token: string = getCookie('jwt_auth')?.toString() || '';
        let data = await getUserInformation(token, userId as string);

        if(data) {
            setCookie('userInformation', data); 
            setUserInformation(data);
        }
    }

    useEffect(() => {
        if(!userId) return;
        getAndSetUserInformation();
    }, [userId]);
    
    return (
        <>
            <Navbar></Navbar>
            {isLoading
                ? (<Spinner></Spinner>)
                : (<Profile isEditable={true} handleProfileChange={getAndSetUserInformation} {...userInformation}/>)
            }
        </>
    )
}