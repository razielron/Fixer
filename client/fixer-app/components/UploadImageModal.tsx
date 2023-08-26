import { ApiResponseModel } from "@/src/models/apiModel";
import { getCookie, setCookie } from "cookies-next";
import React, { useState } from "react";
import Upload from "./Upload";
import Spinner from "./Spinner";
import { UserModel } from "@/src/models/userModel";

interface Props {
  setShowModal : (bool: boolean) => void
  handleProfileChange?: () => void;
}

const UploadImageModal: React.FC<Props> = ({setShowModal, handleProfileChange}) => {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const [s3key, setS3key] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  async function updateUserImage(){
    let updateUserImage: UserModel = {
        photo: s3key
    };
    
    fetch('/api/user', {method: 'PUT', headers, body: JSON.stringify(updateUserImage)})
      .then(res => res.json())
      .then((response: ApiResponseModel<UserModel[]>) => {
        console.log({response})
      });
  };

  async function handleUpload() {
    await updateUserImage();
    setShowModal(false);
    if(handleProfileChange) {
      handleProfileChange();
    }
  }

  return (
    <>
      
        <>
          <div
            className="mt-24 justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                    Upload Profile Image
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">

                </div>
                {/*footer*/}
                <div className="flex justify-center p-4 pt-0">
                  <Upload setIsLoading={setIsLoading} updateKey={setS3key}></Upload>
                </div>
                {isLoading && (<Spinner></Spinner>)}
                <div className="flex items-center justify-end p-4 pt-0 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className=" py-2 rounded-md w-full mt-6 transion"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button 
                      className={`bg-yellow-400 py-2 rounded-md w-full mt-6 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      type="button" 
                      disabled={isLoading} 
                      onClick={handleUpload} 
                  > 
                      Upload 
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      
    </>
  );
}

export default UploadImageModal