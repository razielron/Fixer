import React from "react";
import Select from "react-dropdown-select";

interface DropDownProps{
    options:any;
    onChange:any;
    placeHolder:string;
}

const DropDown: React.FC<DropDownProps> = ({
    options,
    onChange,
    placeHolder
    
}) => {
    return (
        <div className="relative">
                    <Select 
                        className="
                        bg-white
                        rounded-md
                        text-md	
                    "
                        options={options} 
                        onChange={onChange}
                        placeholder={placeHolder}
                    />
        </div>
    )   
}

export default DropDown;