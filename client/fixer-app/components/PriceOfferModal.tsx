import React, { useEffect, useState } from "react";
import Card from "./Card";
import { PriceOfferModel } from "@/src/models/priceOfferModel";
import { CardModel } from "@/src/models/CardModel";
import { getCookie } from "cookies-next";
import PriceOfferForm from "./PriceOfferForm";
import PriceOffer from "./PriceOffer";

type Props =   {
    priceOfferArray?: PriceOfferModel[]
    cardData: CardModel
    getPriceOffers: (cardId: string) => Promise<PriceOfferModel[]>
    createpriceOffer: (priceOffer: PriceOfferModel, autherId: string, cardId: string) => Promise<PriceOfferModel>
    hideModal: () => void
}

const PriceOfferModal: React.FC<Props> = (props) => {
  const [priceOffers, setPriceOffers] = useState<PriceOfferModel[]>([]);
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};

  let handleNewpriceOffer = (priceOffer: PriceOfferModel) => {
    if(!props.cardData?.autherId || !props.cardData?.id) return;
    props.createpriceOffer(priceOffer, props.cardData.autherId, props.cardData.id)
        .then((createdpriceOffer) => {
            setPriceOffers([...priceOffers, createdpriceOffer]);
        });
  }

  useEffect(() => {
    if(!props.cardData?.id) return;
    props.getPriceOffers(props.cardData.id)
        .then((priceOffers:PriceOfferModel[]) => {
            setPriceOffers(priceOffers);
        });
  }, []);

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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Card cardData={props.cardData} isModalOpen={false} />
                        <div className="overflow-auto pl-5">
                        {priceOffers && priceOffers.map((priceOffer) => (<PriceOffer priceOffer={priceOffer} />))}
                        </div>
                        <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                        <div className="">
                        <PriceOfferForm onSubmit={handleNewpriceOffer} />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div onClick={props.hideModal} className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default PriceOfferModal;