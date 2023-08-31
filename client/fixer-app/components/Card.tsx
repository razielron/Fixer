import { useEffect, useState } from "react";
import GalleryModal from "./GalleryModal";
import { CardModel } from "@/src/models/CardModel";
import PriceOfferModal from "./PriceOfferModal";
import { getCookie } from "cookies-next";
import router from "next/router";

type Props =   {
    isModalOpen: boolean
    cardData: CardModel
    isPostView?: boolean
    openCardView?: (cardData: CardModel) => void
    openPriceOfferView?: (cardData: CardModel) => void
}

const Card: React.FC<Props> = (props) => {
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [isShowGalleryModal, setIsShowGalleryModal] = useState(false);
  const [showPriceOffer, setShowPriceOffer] = useState<boolean>(false);

  const getUserInformation = () => { 
      let cookie = getCookie('userInformation') as string; 
      if(!cookie) return; 
      let userInfo = JSON.parse(cookie); 
      if(!userInfo) return; 
      return userInfo; 
  }
  
  const shouldShowPriceOffer = () => {
    let userInformation = getUserInformation();

    if (userInformation?.role === 'PROFESSIONAL' || userInformation?.id === props.cardData.autherId){
        setShowPriceOffer(true)
    }
    if(props.isPostView){
        setShowPriceOffer(false)
    }
  }

  useEffect(() => {
    shouldShowPriceOffer();
    fetchCardImages();
  }, []);

  let fetchCardImages = async () => {
    if(!props.cardData?.imageUrls?.length) return;

    let asyncImages = props.cardData.imageUrls.map(async (imageUrl) => {
        let response = await fetch(imageUrl);
        let imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
    });

    let imageArrayResponse = await Promise.all(asyncImages);
    setImageArray(imageArrayResponse);
  }

  let handleCommentClick = () => {
    if(!props?.openCardView) return;
    props.openCardView(props.cardData);
  }

  let handlePriceOfferClick = () => {
    if(!props?.openPriceOfferView) return;
    props.openPriceOfferView(props.cardData);
  }

  const showGalleryModal = () => {
    setIsShowGalleryModal(true);
  }

  const hideGalleryModal = () => {
    setIsShowGalleryModal(false);
  }

  const openProfile = () => {
    if(!props?.cardData?.autherId) return;
    router.push(`/profile/${props.cardData?.autherId}`);
  }

  return (
    <div className='flex items-center justify-center mt-4'> 
        <div className="rounded-xl border p-5 shadow-md w-9/12 bg-white">

            <div className="flex w-full items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                    <img className="h-8 w-8 rounded-full bg-slate-400" src={props.cardData.autherPhotoUrl || "/images/profile.jpg"} alt="" />
                    <div onClick={openProfile} className="text-lg font-bold text-slate-700 cursor-pointer">{props.cardData?.autherName}</div>
                </div>
                <div className="flex items-center space-x-8">
                    {props.cardData?.profession &&<button className="rounded-3xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">{props.cardData.profession.toLocaleLowerCase()}</button>}
                    {props.cardData?.createdAt && (<div className="text-xs text-neutral-500">{(new Date(props.cardData.createdAt)).toLocaleString('he-IL', {timeZone:'Asia/Jerusalem'})}</div>)}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="mb-3 text-3xl font-bold">{props.cardData?.title}</div>
                <div className="text-xl text-neutral-600">{props.cardData?.body}</div>
            </div>

            <div className="mt-4 mb-6">
                {imageArray && (
                    <div className="flex content-center w-full">
                        {imageArray.map((image) => (
                            <img onClick={showGalleryModal} className="h-28 w-28 pl-5" src={image} key={Math.floor(Math.random() * 1000)} />
                        ))}
                    </div>
                )}
                {imageArray && isShowGalleryModal && (
                    <GalleryModal hideModal={hideGalleryModal} imageArray={imageArray}/>
                )}
            </div>

           { props.isModalOpen && <div>
                <div className="flex items-center justify-between text-slate-500">
                    <div className="flex space-x-4 md:space-x-8">
                        <div onClick={handleCommentClick} className="flex cursor-pointer items-center transition hover:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>Comment</span>
                        </div>
                        {showPriceOffer && 
                        <div onClick={handlePriceOfferClick} className="flex cursor-pointer items-center transition hover:text-slate-600">
                        <svg viewBox="0 0 24 24" fill="currentColor"className="mr-1.5 h-5 w-5" {...props}> <path fill="none" d="M0 0h24v24H0z" /> 
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-3.5-6H14a.5.5 0 100-1h-4a2.5 2.5 0 110-5h1V6h2v2h2.5v2H10a.5.5 0 100 1h4a2.5 2.5 0 110 5h-1v2h-2v-2H8.5v-2z" />
                        </svg>
                            <span>Price Offer</span>
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    </div>
  );
}
  
export default Card;
