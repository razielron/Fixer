import React from "react";
import Slider from "./Slider";

type Props =   {
    imageArray: string[]
    hideModal : () => void
}

const GalleryModal: React.FC<Props> = (props) => {
  return (
    <>
        <div
        className="mt-24 justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <button onClick={props.hideModal} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Slider iamgeArray={props.imageArray}></Slider>
                    </div>
                </div>
            </div>
        </div>
        <div onClick={props.hideModal} className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default GalleryModal;