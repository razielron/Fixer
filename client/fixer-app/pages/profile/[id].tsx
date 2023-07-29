import Profile from "@/components/Profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"

interface UserInformation {
    id: string;
    name: string;
    email: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const [userInformation, setUserInformation] = useState<UserInformation>({ id: '', name: '', email: '' }); 

    async function getUserInformation() {
        let response = await fetch(`/api/user/${id}`);
        let data = await response.json();
        return data;
    }

    useEffect(() => {
        getUserInformation().then((data: UserInformation) => {
            setUserInformation(data);
        });
    }, []);

    return (
        <Profile id={userInformation.id} name={userInformation.name} email={userInformation.email}/>
    )
}

// Profile.getInitialProps = (Props: { query: { id: any; }; }) => {
//     return { id: Props.query.id }
// }