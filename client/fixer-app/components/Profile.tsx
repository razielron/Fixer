import { Role } from "@/src/enums/role";
import { UserModel } from "@/src/models/userModel";
import React, { useState } from "react";
import UploadImageModal from "./UploadImageModal";

interface Props extends UserModel {
    key?: string,
    isEditable?: boolean
    handleProfileChange?: () => void
}

const Profile: React.FC<Props> = (props) => {   
    const [showModal, setShowModal] = useState(false);

    function handleImageClick(){
        if(!props.isEditable) return;
        setShowModal(true);
    }

    function convertOptionToDisplay(option: string | undefined) : string | undefined{
        if (!option) return 
        return option 
            .split('_') 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return (
        <>
            <div className="h-full p-20 pt-5 pb-5 pb-0">
                <div className="border-b-2 block md:flex">
                    <div className="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
                        <div className="flex justify-between">
                            <span className="text-xl font-semibold block">User Profile</span>
                            {
                            //<a href="#" className="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800">Edit</a>
                            }
                        </div>

                        <span className="text-gray-600">Information of Fixer account</span>
                        <div className="mt-10">
                        <img 
                            onClick={handleImageClick} 
                            className="max-w-xs w-32 items-center border cursor-pointer mb-3" 
                            src={props.photoUrl || "/images/profile.jpg"}
                            style={{cursor: props.isEditable ? 'pointer' : 'default'}}
                        />
                        {showModal && <UploadImageModal setShowModal={setShowModal} handleProfileChange={props.handleProfileChange}></UploadImageModal>}
                        </div>
                    </div>
                    
                    <div className="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
                    <div className="rounded  shadow p-6 pb-0">
                        <div className="pb-6">
                        <label htmlFor="first name" className="font-semibold text-gray-700 block pb-1">First Name</label>
                        <div className="flex">
                            <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full" type="text" value={props.firstName} />
                        </div>
                        </div>
                        <div className="pb-6">
                        <label htmlFor="last name" className="font-semibold text-gray-700 block pb-1">Last name</label>
                        <div className="flex">
                            <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full" type="text" value={props.lastName} />
                        </div>
                        </div>
                        {props.role=== Role.PROFESSIONAL && <div className="pb-6">
                        <label htmlFor="phone number" className="font-semibold text-gray-700 block pb-1">Phone number</label>
                        <div className="flex">
                            <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full" type="text" value={props.phoneNumber} />
                        </div>
                        </div>}
                        {props.role=== Role.PROFESSIONAL && <div className="pb-6">
                        <label htmlFor="proffesion" className="font-semibold text-gray-700 block pb-1">Proffesion</label>
                        <div className="flex">
                            <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full" type="text" value={convertOptionToDisplay(props.profession)} />
                        </div>
                        </div>}

                        <div className="pb-6">
                        <label htmlFor="district" className="font-semibold text-gray-700 block pb-1">District</label>
                        <div className="flex">
                            <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full" type="text" value={convertOptionToDisplay(props.address)} />
                        </div>
                        </div>

                        <div className="pb-4">
                        <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Email</label>
                        <input disabled id="email" className="border-1  rounded-r px-4 py-2 w-full" type="email" value={props.email} />
                        {/* <span className="text-gray-600 pt-4 block opacity-70">Personal login information of your account</span> */}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;