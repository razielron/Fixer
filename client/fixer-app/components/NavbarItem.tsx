import { useRouter } from "next/router";
import React from "react";

interface NavbarItemProps {
    label: string;
    value: string;
}

const NavbarItem: React.FC<NavbarItemProps> =({label, value}) => {
    const router = useRouter();

    function getHighlight() {
        const currentPath = router.pathname.slice(1);
        let highlight = undefined;

        if(value === currentPath) {
            highlight = 'bg-gray-500';
        }

        return highlight;
    }

    function onClick() {
        router.push(`/${value}`);
    }

    //For Some reason, when using client side routing, the page won't appear properly
    return (
        <>
            <a href={`/${value}`} className={`flex items-center rounded h-12 px-6 m-2 text-lg text-white cursor-pointer no-underline hover:bg-gray-500 ${getHighlight()}`}>
                {label}
            </a>
            {/* <div onClick={onClick} className="text-white cursor-pointer hover:text-gray-300 transition">
                {label}
            </div> */}
        </>
    )
}

export default NavbarItem