import ApiResponseModel from "@/src/models/apiModel";
import { IssueModel } from "@/src/models/issueModel";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import DropDown from "./DropDown";
import Input from "./input";

export default function Modal() {
  const options = [
    { 
        value: 1,
        label: "ELECTRICIAN"
    },
    {
        value:  2,
        label: "PROGRAMER"
    }
];

  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const [title, setTitle] = useState('')
  const [check, setCheck] = useState(false);
  const [body, setBody] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = React.useState(false);

  function createIssue(){
    let createIssue: IssueModel = {
      title,
      body,
      profession: role,
      autherId: '78d888ba-e994-4f6f-b40d-ef615e788ed8'
    };

    fetch('/api/issue', {method: 'POST', headers, body: JSON.stringify(createIssue)})
      .then(res => res.json())
      .then((response: ApiResponseModel<IssueModel[]>) => {
        console.log({response});
        setShowModal(false);
    });
  };

  return (
    <>
      <button
        className="	h-12 px-6 content-center bg-yellow-400 "
        type="button"
        onClick={() => setShowModal(true)}
      >
        Create New Issue
      </button>
      {showModal ? (
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
                    Create issue
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
                <div className="flex flex-col gap-4">
                    <Input
                        onChange = {(event:any)=> setTitle(event.target.value)}
                        id = "title"
                        type = "name"
                        value = {title}
                        placeHolder = "Title"
                    />
                    <Input
                        onChange = {(event:any)=> setBody(event.target.value)}
                        id = "body"
                        type = "textarea"
                        value = {body}
                        placeHolder = "Body"
                    />


                  <DropDown 
                        options={options} 
                        onChange={(event:any)=> setRole(event[0].label)}
                        placeHolder="Role"   
                    />


                </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className=" py-2 rounded-md w-full mt-6 transion"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion"
                    type="button"
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
      ) : null}
    </>
  );
}