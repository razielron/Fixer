import React from "react";
import { deleteCookie} from 'cookies-next';
import { useRouter } from "next/router";
import { UserModel } from "@/src/models/userModel";

const AccountMenu: React.FC<UserModel> = (props) => {
    const router = useRouter();

    const signOut = async () => {
        deleteCookie('jwt_auth');
        deleteCookie('userInformation')
        router.push('/');
    };

    return (
        <div className="bg-black w-56 absolute top-14 right-0 py-4 flex-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-2">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full" onClick={() => router.push(`/profile/${props.id}`)}>
                    <img className="w-8 rounded-md" src="/images/profile.jpg" alt="" />
                        <p className="text-xl text-white text-sm group-hover/item:underline">
                            {props.name}
                        </p>
                </div>
                <hr className="bg-gray-600 border-0 h-px my-4" />
                <div onClick={() => signOut()} className="px-3 text-center text-white text-lg hover:underline">
                    Sign out
                </div>
            </div>
        </div>
    )
}

export default AccountMenu;