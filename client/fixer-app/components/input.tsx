import React from "react";

interface InputProps{
    id:string;
    onChange:any;
    placeHolder:string;
    value:string;
    type?:string;
}

const Input: React.FC<InputProps> = ({
    id,
    onChange,
    value,
    type,
    placeHolder
}) => {
    return (
        <div className="relative">
            <input
                type = {type}
                value = {value}
                id={id}
                onChange = {onChange}
                className="
                    bg-natural-700
                    blcok
                    rounded-md
                    px-3
                    pb-3
                    w-full
                    text-md
                    apperance-none
                    focus:outline-none
                    focus:ring-0
                    peer
                "
                placeholder={placeHolder}
            />
        </div>
    )   
}

export default Input;