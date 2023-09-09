import React from "react";

type Props =   {
    title?: string;
    price?: number;
    currency?: string;
    photoUrl?: string;
    hideModal: () => void
}

const PurchaseModal: React.FC<Props> = (props) => {
  return (
    <>
        <div className="mt-24 justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flow-root flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                        <button onClick={props.hideModal} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex items-center flex-col">
                            <div className="p-5"></div>
                            <div className="overflow-auto pl-5">
                                Thank you for Purchasing {props.title}!
                            </div>
                            <div className="overflow-auto pl-5">
                                It cost you: {props.currency}{props.price}
                            </div>
                            <img className="p-4 rounded-t-lg object-scale-down h-48 w-96" src={props.photoUrl} alt="product image" />
                            <div className="p-4"></div>
                        </div>
                        <button onClick={props.hideModal} className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div onClick={props.hideModal} className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default PurchaseModal;