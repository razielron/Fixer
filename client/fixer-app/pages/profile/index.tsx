import Profile from "@/components/Profile";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Spinner from '@/components/Spinner';
import Navbar from "@/components/Navbar";
import { UserModel } from "@/src/models/userModel";

export default function ProfilePage() {
    const defaultProfession = 'electrician';
    const [usersInformation, setUsersInformation] = useState<UserModel[]>([]); 
    const [selectedProfession, setSelectedProfession] = useState<string>(defaultProfession); 
    const [nameFilter, setNameFilter] = useState<string>(''); 
    const [isLoading, setIsLoading] = useState(false);

    async function getUsersInformation(token : string, profession: string) {
        const headers = {Authorization: `Bearer ${token}`};
        profession = profession.toUpperCase();
        let params = new URLSearchParams({profession});
        let response = await fetch(`/api/user?${params}`, {headers});
        let jsonRes = await response.json();
        return jsonRes.data;
    }

    useEffect(() => {
        setIsLoading(true);
        const token: string = getCookie('jwt_auth')?.toString() || '';
        getUsersInformation(token, selectedProfession).then((data: UserModel[]) => {
            if(!data?.length) {
                data = [{ id: 'a', name: 'a', email: 'a' }, { id: 'b', name: 'b', email: 'b' }];
            }
            setUsersInformation(data);
            setIsLoading(false);
        });
    }, [selectedProfession]);

    return (
        <>
            <Navbar></Navbar>
            {isLoading
                ? (<Spinner></Spinner>)
                : usersInformation.filter((user: UserModel) => {
                    return nameFilter !== '' && user?.name?.includes(nameFilter);
                }).map((userInfo: UserModel) => (
                    <Profile {...userInfo}/>
                ))
            }
        </>
    )
}