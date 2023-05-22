import { useState } from "react";
import Input from "./input";
import { CommentModel } from "@/src/models/commentModel";

interface Props {
    comment: CommentModel
}

const Comment: React.FC<Props> = (props) => {
    return (
        <>
            <div className="flex items-center space-x-2">
                <div className="group relative flex flex-shrink-0 self-start cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1507965613665-5fbb4cbb8399?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDQzfHRvd0paRnNrcEdnfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="" className="h-8 w-8 object-fill rounded-full"/>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <div className="block">
                        <div className="flex justify-center items-center space-x-2">
                            <div className="bg-gray-100 w-auto rounded-xl px-2 pb-2">
                                <div className="font-medium">
                                    <a href="#" className="hover:underline text-sm">
                                        <small>Ganendra</small>
                                    </a>
                                </div>
                                <div className="text-xs">
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita, maiores!
                                </div>
                            </div>
                            <div className="self-stretch flex justify-center items-center transform transition-opacity duration-200 opacity-0 hover:opacity-100">
                                <a href="#" className="">
                                    <div className="text-xs cursor-pointer flex h-6 w-6 transform transition-colors duration-200 hover:bg-gray-100 rounded-full items-center justify-center">
                                        <svg className="w-4 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="flex justify-start items-center text-xs w-full">
                            <div className="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1">
                                <a href="#" className="hover:underline">
                                    <small>Like</small>
                                </a>
                                <small className="self-center">.</small>
                                <a href="#" className="hover:underline">
                                    <small>Reply</small>
                                </a>
                                <small className="self-center">.</small>
                                <a href="#" className="hover:underline">
                                    <small>15 hour</small>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
  }
  export default Comment;