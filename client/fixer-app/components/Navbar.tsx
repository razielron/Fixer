import { useCallback, useState } from "react";
import NavbarItem from "@/components/NavbarItem";
import AccountMenu from "./AccountMenu";
import { BsChevronDown ,BsSearch, BsBell} from 'react-icons/bs';
import { getCookie } from "cookies-next";

const Navbar = () => {
    const [showAccountMenu, setShowAccountMenu] = useState(false)
    const [userInformation, setUserInformaion] = useState<any>('');

    const toggleAccountMenu = useCallback(() => {
        setShowAccountMenu((current) => !current);
        let cookie = getCookie('userInformation') as string;
        if(!cookie) return;
        let userInfo = JSON.parse(cookie);
        if(!userInfo) return;
        setUserInformaion(userInfo);
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
                    <NavbarItem label='Home' />
                    <NavbarItem label='Fourm' />
                    <NavbarItem label='Profesionals' />
                    <NavbarItem label='Store' />
              </div>
              <div className="flex flex-row ml-auto gap-7 items-center">
                    <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                        <BsSearch />
                    </div>

                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src="/images/profile.jpg" alt=""/>
                        </div>
                        <BsChevronDown className="text-white transition" />
                        {showAccountMenu && <AccountMenu name={userInformation.name} />}

                    </div>
              </div>

            </div>
        </nav>

    )
}

export default Navbar;