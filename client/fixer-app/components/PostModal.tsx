import { ApiResponseModel } from "@/src/models/apiModel";
import { PostModel } from "@/src/models/postModel";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import Input from "./input";
import Upload from "./Upload";

interface Props {
  handleNewPost: (post: PostModel) => void;
}

const PostModal: React.FC<Props> = ({handleNewPost}) => {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('');
  const [s3key, setS3key] = useState<string>('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = React.useState(false);

  function createPost(){
    let createPostModel: PostModel = {
      title,
      body,
      photo: s3key
    };

    fetch('/api/post', {method: 'POST', headers, body: JSON.stringify(createPostModel)})
      .then(res => res.json())
      .then((response: ApiResponseModel<PostModel[]>) => {
        handleNewPost(createPostModel);
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
                    Create post
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
                </div>
                </div>
                {/*footer*/}
                <div className="flex justify-center p-4 pt-0">
                  <Upload updateKey={setS3key}></Upload>
                </div>
                <div className="flex items-center justify-end p-4 pt-0 border-t border-solid border-slate-200 rounded-b">
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
                    onClick={createPost}
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

export default PostModal