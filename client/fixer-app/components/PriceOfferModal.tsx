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
                    <div className="flow-root flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <button onClick={props.hideModal}>X</button>
                        <Card cardData={props.cardData} isModalOpen={false} />
                        <div className="overflow-auto">
                        {priceOffers && priceOffers.map((priceOffer) => (<PriceOffer priceOffer={priceOffer} />))}
                        </div>
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