import Profile from "@/components/Profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { getCookie } from "cookies-next";
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

    useEffect(() => {
        if(!userId) return;
        const token: string = getCookie('jwt_auth')?.toString() || '';
        getUserInformation(token, userId as string).then((data: UserModel) => {
            if(data) {
                setUserInformation(data);
            }
        });
    }, [userId]);

    return (
        <>
            <Navbar></Navbar>
            {isLoading
                ? (<Spinner></Spinner>)
                : (<Profile {...userInformation}/>)
            }
        </>
    )
}