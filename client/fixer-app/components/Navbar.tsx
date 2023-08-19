import { useCallback, useState } from "react";
import NavbarItem from "@/components/NavbarItem";
import AccountMenu from "./AccountMenu";
import { BsChevronDown} from 'react-icons/bs';
import { getCookie } from "cookies-next";
import { UserModel } from "@/src/models/userModel";

const Navbar = () => {
    const [showAccountMenu, setShowAccountMenu] = useState(false)
    const [userInformation, setUserInformation] = useState<UserModel>({});

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
              py-6
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
                 gap-7
                 hidden
                 lg:flex">
                    <NavbarItem label='Home' value="issues" />
                    <NavbarItem label='Forum' value='forum' />
                    <NavbarItem label='Professionals' value='professionals' />
                    {/* <NavbarItem label='Store' value='store' /> */}
              </div>
              <div className="flex flex-row ml-auto gap-7 items-center">
                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src="/images/profile.jpg" alt=""/>
                        </div>
                        <BsChevronDown className="text-white transition" />
                        {showAccountMenu && <AccountMenu id={userInformation.id} name={userInformation.name} email={userInformation.email} />}
                    </div>
              </div>
            </div>
        </nav>

    )
}

export default Navbar;