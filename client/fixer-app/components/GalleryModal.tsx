
import React, { useState } from "react";
import Slider from "./Slider";

type Props =   {
    imageArray: string[]
    hideModal : () => void
  }

const GalleryModal: React.FC<Props> =(props) => {

  return (
    <>
        <div
        className="mt-24 justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <button onClick={props.hideModal}>X</button>
                        <Slider pictures={props.imageArray}></Slider>
                    </div>
                </div>
            </div>
        </div>
        <div onClick={props.hideModal} className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default GalleryModal;