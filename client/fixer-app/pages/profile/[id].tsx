import Profile from "@/components/Profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import { UserModel } from "@/src/models/userModel";

export default function ProfilePage() {
    const router = useRouter();
    const userId = router.query.id;
    const [userInformation, setUserInformation] = useState<UserModel>({}); 

    async function getUserInformation(token: string, id: string) {
        const headers = {Authorization: `Bearer ${token}`};
        let params = new URLSearchParams({id});
        let response = await fetch(`/api/user?${params}`, {headers});
        let jsonRes = await response.json();
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
            <Profile {...userInformation}/>
        </>
    )
}