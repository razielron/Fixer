import React, { use, useEffect, useRef, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import Message from "@/src/models/openaiModels";
import { UserModel } from "@/src/models/userModel";

const ChatModal: React.FC = () => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const bottomRef = useRef<null | HTMLDivElement>(null);

    let saveConversation = async () => {
        setCookie('conversation', JSON.stringify(conversation));
    }

    let getConversation = async () => {
        let cookie = getCookie('conversation') as string;
        if(!cookie) return;
        let conversation = JSON.parse(cookie);
        if(!conversation) return;
        setConversation(conversation);
    }

    let sendMessage = async (userMessageText: string) => {
        console.log({userMessageText})
        if(!userMessageText) return;
        setIsLoading(true);

        let userMessage: Message = {
            id: conversation.length,
            role: 'user',
            content: userMessageText,
            createdAt: new Date(),
        }

        let newConversation = [...conversation, userMessage];
        console.log({newConversation})
        setConversation(newConversation);

        let newContentResponse = await fetch(
            '/api/openai',
            {method: 'POST', body: JSON.stringify({conversation, message: userMessageText}),
            headers: {'Content-Type': 'application/json'}}
        );
        let newContent = await newContentResponse.json();

        let newMessage: Message = {
            id: conversation.length + 1,
            role: 'assistant',
            content: newContent.message,
            createdAt: new Date(),
        }

        newConversation = [...newConversation, newMessage];
        console.log({newConversation})
        setConversation(newConversation);
        setIsLoading(false);
    }

    let handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const handleKeyDown = (event: any) => {
        console.log({isLoading})
        if(isLoading) return;
        // look for the `Enter` keyCode
        if (event.keyCode === 13 || event.which === 13) {
            sendMessage(message);
            setMessage('');
        }
    }

    const closeModal = () => {
        saveConversation();
        setConversation([]);
        setMessage('');
        setShowModal(false);
    }

    function timeAgo(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const secondsPast = (now.getTime() - date.getTime()) / 1000;
      
        if (secondsPast < 60) {
          return `${Math.floor(secondsPast)} seconds ago`;
        }
        if (secondsPast < 3600) {
          return `${Math.floor(secondsPast / 60)} minutes ago`;
        }
        if (secondsPast <= 86400) {
          return `${Math.floor(secondsPast / 3600)} hours ago`;
        }
        if (secondsPast > 86400) {
          const day = date.getDate();
          const month = date.toDateString().match(/ [a-zA-Z]*/)?.[0]?.replace(" ", "") || "";
          const year = date.getFullYear() === now.getFullYear() ? "" : ` ${date.getFullYear()}`;
          return `${day} ${month}${year}`;
        }
    }

    function getUserAvatar(): string {
        const base64String = localStorage.getItem('userAvatar');
        if (base64String) {
            return `data:image/jpeg;base64,${base64String}`;
        }

        return '/images/profile.jpg';
    }

    useEffect(() => {
        setIsLoading(false);
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [conversation]);

    useEffect(() => {
        if (showModal) {
            getConversation();
        }
    }, [showModal]);
    
    return (
        <>
            <button
                className="fixed z-90 bottom-10 right-8 bg-yellow-500 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-yellow-400 hover:drop-shadow-2xl hover:animate-bounce duration-300"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Chat
            </button>
            {showModal && (
                <>
                    <div
                        className="mt-24 justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        AI Chat
                                    </h3>
                                    <button onClick={closeModal} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Close menu</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative flex-grow">
                                    {/*chat*/}
                                    <div className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
                                        <div className="flex flex-col flex-grow p-4 overflow-auto" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 20rem)' }}>
                                            { !conversation.length
                                            ? <span className="self-center">- Start a new conversation with our AI -</span>
                                            : conversation.sort((x, y) => x.id - y.id).map((message) => {
                                                return message.role !== 'user'
                                                ?
                                                    (
                                                        <div key={message.id} className="flex w-full mt-2 space-x-3 max-w-xs">
                                                            <div className="flex-shrink-0 h-12 w-12 border rounded-full">
                                                                <img className="rounded-full h-12 w-12 bg-slate-400" src="/images/ai-logo.png" alt=""/>
                                                            </div>
                                                            <div>
                                                                <div className="bg-yellow-500 p-3 rounded-r-lg rounded-bl-lg">
                                                                    <p className="text-sm m-0">{message.content}</p>
                                                                </div>
                                                                <span className="text-xs text-gray-500 leading-none">{timeAgo(message.createdAt.toString())}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                :
                                                    (
                                                        <div key={message.id} className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                                                            <div>
                                                                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                                                    <p className="text-sm m-0">{message.content}</p>
                                                                </div>
                                                                <span className="text-xs text-gray-500 leading-none">{timeAgo(message.createdAt.toString())}</span>
                                                            </div>
                                                            <div className="flex-shrink-0 h-12 w-12 border rounded-full">
                                                                <img className="rounded-full h-12 w-12 bg-slate-400" src={getUserAvatar()} alt=""/>
                                                            </div>
                                                        </div>
                                                    )
                                            })}
                                            <div ref={bottomRef}></div>
                                        </div>
                                        
                                        <div className="bg-gray-300 p-4">
                                            <input onKeyDown={handleKeyDown} onChange={handleChange} value={message} className="flex items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    );
}

export default ChatModal;