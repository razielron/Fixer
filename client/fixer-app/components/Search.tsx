import React, { useState } from "react";

interface SearchProps {
    defaultSearch: string;
    performSearch: (search: string, option: string) => void;
    options: string[];
}

const Search: React.FC<SearchProps> = (props) => {
    const [search, setSearch] = useState<string>(props.defaultSearch);
    const [selectedOption, setSelectedOption] = useState<string>('');

    function handleOptionClicked(event: string[]) {
        setSelectedOption(event[0]);
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    function handleSearchClicked(event: any) {
        event.preventDefault();
        props.performSearch(search, selectedOption);
    }

    const handleKeyDown = (event: any) => {
        // look for the `Enter` keyCode
        if (event.keyCode === 13 || event.which === 13) {
            handleSearchClicked(event);
        }
    }

    return (
        <div className="flex items-center justify-center h-20 p-6 space-x-6 bg-white rounded-xl shadow-lg">
            <div className="flex bg-gray-100 h-12 p-4 w-80 space-x-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type='text' value={search} onChange={handleSearchChange} onKeyDown={handleKeyDown} className="bg-gray-100 outline-none" placeholder="Professional name..." />
            </div>
            <div className="flex py-3 px-0 rounded-lg text-gray-500 font-semibold cursor-pointer">
                <span>All professions</span>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <button type='submit' onClick={handleSearchClicked} className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
                <span>Search</span>
            </button>
        </div>
    )
}

export default Search;