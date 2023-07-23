import React from "react";
import { deleteCookie} from 'cookies-next';
import { useRouter } from "next/router";

interface AccountMenuProps {
    name: string;
}

const AccountMenu: React.FC<AccountMenuProps> = ({name}) => {
    const router = useRouter();

    const signOut = async () => {
        deleteCookie('jwt_auth');
        deleteCookie('userInformation')
        router.push('/'); 
    };

    return (
        <div className="bg-black w-56 absolute top-14 right-0 py-5 flext-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-3">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full" onClick={() => router.push('/profile')}>
                    <img className="w-8 rounded-md" src="/images/profile.jpg" alt="" />
                        <p className="text-white text-sm group-hover/item:underline">
                            {name ?? ''}
                        </p>
                </div>
                <hr className="bg-gray-600 border-0 h-px my-4" />
                <div onClick={() => signOut()} className="px-3 text-center text-white text-sm hover:underline">
                    Sign out
                </div>
            </div>
        </div>
    )
}

export default AccountMenu;