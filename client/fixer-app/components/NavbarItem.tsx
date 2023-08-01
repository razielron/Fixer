import { useRouter } from "next/router";
import React from "react";

interface NavbarItemProps {
    label: string;
    value: string;
}

const NavbarItem: React.FC<NavbarItemProps> =({label, value}) => {
    const router = useRouter();

    function onClick() {
        router.push(`/${value}`);
    }

    //For Some reason, when using client side routing, the page won't appear properly
    return (
        <>
            <a href={`/${value}`} className="text-white cursor-pointer hover:text-gray-300 transition no-underline">
                {label}
            </a>
            {/* <div onClick={onClick} className="text-white cursor-pointer hover:text-gray-300 transition">
                {label}
            </div> */}
        </>
    )
}

export default NavbarItem