import React, { useEffect, useState } from "react";

interface SearchProps {
    defaultSearch: string;
    performSearch: (search: string) => void;
    options?: string[];
    performSelect?: (option: string) => void;
    inputPlaceHolder: string;
}

const Search: React.FC<SearchProps> = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(props.defaultSearch);
    const [selectedOption, setSelectedOption] = useState<string>(props.options?.[0] ?? '');

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    }
    function toEnumValue(displayName: string): string { 
        return displayName 
            .split(' ')  // Split by space 
            .map(word => word.toUpperCase())  // Convert each word to uppercase 
            .join('_');  // Join words with an underscore 
    }

    function handleSelect(option: string) {
        setDropdownOpen(false);
        setSelectedOption(option);
        
        if(props.performSelect) {
            props.performSelect(toEnumValue(option));
        }
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    function handleSearchClicked(event: any) {
        event.preventDefault();
        props.performSearch(search);
    }

    const handleKeyDown = (event: any) => {
        // look for the `Enter` keyCode
        if (event.keyCode === 13 || event.which === 13) {
            handleSearchClicked(event);
        }
    }

    function OptionsToDisplay(options: string[]) : string[] {
        return options.map(convertOptionToDisplay);
    }

    function convertOptionToDisplay(option: string) : string {
        return option 
            .split('_') 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return (
        <div className="flex items-center justify-center h-20 p-6 space-x-6 bg-white rounded-xl shadow-lg">
            {props.options &&
                <div className={`relative border ${dropdownOpen ? 'border-yellow-300' : 'border-transparent'} rounded-lg`}>
                    <div className="relative flex align-center w-40 py-3 px-3 rounded-lg text-gray-500 font-semibold cursor-pointer" onClick={toggleDropdown}>
                        <span>{convertOptionToDisplay(selectedOption) || "Select..."}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {dropdownOpen && (
                            <div className="origin-bottom absolute -left-4 top-14 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                {OptionsToDisplay(props.options).map((option, index) => (
                                    <div key={index} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => handleSelect(option)}>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            }
            <div className="flex bg-gray-100 h-12 w-80 space-x-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type='text' value={search} onChange={handleSearchChange} onKeyDown={handleKeyDown} className="bg-gray-100 outline-none" placeholder={`${props.inputPlaceHolder}`} />
            </div>
            <button type='submit' onClick={handleSearchClicked} className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
                <span>Search</span>
            </button>
        </div>
    )
}

export default Search;