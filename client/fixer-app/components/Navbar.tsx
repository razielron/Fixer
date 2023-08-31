import { useCallback, useEffect, useState } from "react";
import NavbarItem from "@/components/NavbarItem";
import AccountMenu from "./AccountMenu";
import { BsChevronDown} from 'react-icons/bs';
import { getCookie } from "cookies-next";
import { UserModel } from "@/src/models/userModel";
import { RouterPath, RouterTitle } from "@/src/enums/router";

const Navbar = () => {
    const [showAccountMenu, setShowAccountMenu] = useState(false)
    const [userInformation, setUserInformation] = useState<UserModel>({});

    const updateUserInformationFromCookies = () => {
        let cookie = getCookie('userInformation') as string;
        if(!cookie) return;
        let userInfo = JSON.parse(cookie);
        if(!userInfo) return;
        setUserInformation(userInfo);
    }

    useEffect(() => {
        setTimeout(updateUserInformationFromCookies, 2000);
    }, []);

    const toggleAccountMenu = useCallback(() => {
        let cookie = getCookie('userInformation') as string;
        if(!cookie) return;
        let userInfo = JSON.parse(cookie);
        if(!userInfo) return;
        setUserInformation(userInfo);
        setShowAccountMenu(current => !current);
    }, []);

    return (
        <nav className="w-full z-40">
            <div className="px-4
             md:px-16
              flex
              flex-row
              items-center
              transition
              duration-500
              bg-zinc-900
              bg-opacity-90
            "
            >
              <img className="h-4 lg:h-7" src="/images/fixerLogo.png" alt="Logo"/>
              <div
                className="
                 flex-row
                 ml-8
                 gap-2
                 hidden
                 lg:flex">
                    <NavbarItem label={RouterTitle.HOME} value={RouterPath.HOME} />
                    <NavbarItem label={RouterTitle.FORUM} value={RouterPath.FORUM} />
                    <NavbarItem label={RouterTitle.PROFESSIONAL} value={RouterPath.PROFESSIONAL} />
                    {/* <NavbarItem label='Store' value='store' /> */}
              </div>
              <div className="flex flex-row ml-auto gap-7 items-center">
                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src={userInformation.photoUrl || "/images/profile.jpg"} alt=""/>
                        </div>
                        <BsChevronDown className="text-white transition" />
                        {showAccountMenu && <AccountMenu id={userInformation.id} name={userInformation.name} email={userInformation.email} photoUrl={userInformation.photoUrl} />}
                    </div>
              </div>
            </div>
        </nav>

    )
}

export default Navbar;