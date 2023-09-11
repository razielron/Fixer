import { professionOptions } from "@/src/enums/profession";
import { ApiResponseModel } from "@/src/models/apiModel";
import { IssueModel } from "@/src/models/issueModel";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import DropDown from "./DropDown";
import Input from "./input";
import Upload from "./Upload";
import Spinner from "./Spinner";

interface Props {
  handleNewIssue: (issue: IssueModel) => void;
}

const IssueModal: React.FC<Props> = ({handleNewIssue}) => {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('');
  const [role, setRole] = useState('');
  const [s3key, setS3key] = useState<string>('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function toEnumValue(displayName: string): string { 
    return displayName 
        .split(' ')  // Split by space 
        .map(word => word.toUpperCase())  // Convert each word to uppercase 
        .join('_');  // Join words with an underscore 
}

  function createIssue(){
    let createIssueModel: IssueModel = {
      title,
      body,
      profession: role,
      photo: s3key
    };
    
    fetch('/api/issue', {method: 'POST', headers, body: JSON.stringify(createIssueModel)})
      .then(res => res.json())
      .then((response: ApiResponseModel<IssueModel[]>) => {
        handleNewIssue(createIssueModel);
        setShowModal(false);
    });
  };

  return (
    <>
      <button
        className="fixed z-90 bottom-10 left-8 bg-yellow-500 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-yellow-400 hover:drop-shadow-2xl hover:animate-bounce duration-300"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Create
      </button>
      {showModal && (
        <>
            <div 
                className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none" 
            > 
                <div className="relative mx-auto w-[50vw]"> 
                    {/*content*/} 
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"> 
                        {/*header*/} 
                        <div className="flex items-start justify-start p-2 border-b border-solid border-slate-200 rounded-t"> 
                            <button onClick={() => setShowModal(false)} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"> 
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> 
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> 
                                </svg> 
                            </button> 
                            <div className="p-0 ml-2 text-3xl font-semibold">Create Issue</div>
                        </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="p-0 m-0">
                      <b className="p-0">Title</b>
                    </p>
                    <Input 
                        onChange = {(event:any)=> setTitle(event.target.value)}
                        id = "title"
                        type = "name"
                        value = {title}
                        placeHolder = "Title"
                    />
                  </div>

                  <div>
                    <p className="p-0 m-0">
                      <b className="p-0">Body</b>
                    </p>
                  <Input
                      onChange = {(event:any)=> setBody(event.target.value)}
                      id = "body"
                      type = "textarea"
                      value = {body}
                      placeHolder = "Body"
                  />
                  </div>
                  <div>
                    <p className="p-0 m-0">
                      <b className="p-0">Profession</b>
                    </p>
                  <DropDown 
                      options={professionOptions} 
                      onChange={(event:any)=> setRole(toEnumValue(event[0].label))}
                      placeHolder="Role"   
                  />
                  </div>
                </div>
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
                      type="submit" 
                      disabled={isLoading} 
                      onClick={createIssue} 
                  > 
                      Create 
                  </button>
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

export default IssueModal