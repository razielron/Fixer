import Profile from "@/components/Profile";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Spinner from '@/components/Spinner';
import Navbar from "@/components/Navbar";
import { UserModel } from "@/src/models/userModel";
import Search from "@/components/Search";
import { Profession } from "@/src/enums/profession";

export default function ProfilePage() {
    const options = Object.values(Profession);
    const [profilesToDisplay, setProfilesToDisplay] = useState<UserModel[]>([]); 
    const [usersInformation, setUsersInformation] = useState<UserModel[]>([]); 
    const [selectedProfession, setSelectedProfession] = useState<string>(options[0]); 
    const [nameFilter, setNameFilter] = useState<string>(''); 
    const [isLoading, setIsLoading] = useState(false);

    async function getUsersInformation(token : string, profession: string) : Promise<UserModel[]> {
        setIsLoading(true);
        const headers = {Authorization: `Bearer ${token}`};
        profession = profession.toUpperCase();
        let params = new URLSearchParams({profession});
        let response = await fetch(`/api/user?${params}`, {headers});
        let jsonRes = await response.json();
        setIsLoading(false);
        return jsonRes.data;
    }

    function handleSearch(search: string) {
        setNameFilter(search);
    }

    useEffect(() => {
        const token: string = getCookie('jwt_auth')?.toString() || '';
        getUsersInformation(token, selectedProfession).then((data: UserModel[]) => {
            if(!data?.length) {
                data = [
                    { id: 'demo', name: 'demo', email: 'demo' },
                    { id: 'demo2', name: 'demo2', email: 'demo2' },
                    { id: 'demo23', name: 'demo23', email: 'demo23' },
                    { id: 'demo4', name: 'demo4', email: 'demo4' },
                ];
            }
            setUsersInformation(data);
        });
    }, [selectedProfession]);

    useEffect(() => {
        let filteredUsers = usersInformation
            .filter((user: UserModel) => {
                return !nameFilter || user?.name?.includes(nameFilter);
            }).sort((first: UserModel, second: UserModel) => {
                let name1 = first?.name ?? 'a';
                let name2 = second?.name ?? 'b';
                return (name1 < name2) ? -1 : 1;
            });
        setProfilesToDisplay(filteredUsers);
    }, [usersInformation, nameFilter]);

    return (
        <>
            <Navbar></Navbar>
            <Search
                key="1"
                defaultSearch={nameFilter}
                performSearch={handleSearch}
                options={options}
                performSelect={option => setSelectedProfession(option)}
            />
            {isLoading
                ? (<Spinner></Spinner>)
                :
                <>
                    {
                        profilesToDisplay.length > 0
                        ?
                            profilesToDisplay.map((userInfo: UserModel) => (
                                <Profile key={userInfo.id} {...userInfo}/>
                            ))
                        :
                            <p className="flex items-center justify-center p-14">- NO RESULTS -</p>
                    }
                </>
            }
        </>
    )
}