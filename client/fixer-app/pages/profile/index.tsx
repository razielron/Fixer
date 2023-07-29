import Profile from "@/components/Profile";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Spinner from '@/components/Spinner';

interface UserInformation {
    id: string;
    name: string;
    email: string;
}

export default function ProfilePage() {
    const [usersInformation, setUsersInformation] = useState<UserInformation[]>([]); 
    const [isLoading, setIsLoading] = useState(false);

    async function getUsersInformation() {
        let response = await fetch(`/api/user`);
        let data = await response.json();
        return data;
    }

    useEffect(() => {
        setIsLoading(true);
        getUsersInformation().then((data: UserInformation[]) => {
            setUsersInformation(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            {isLoading
                ? (<Spinner></Spinner>)
                : usersInformation.map((userInfo : UserInformation) => (
                    <Profile id={userInfo.id} name={userInfo.name} email={userInfo.email}/>
                ))
            }
        </>
    )
}