import { useEffect, useState } from "react";
import GalleryModal from "./GalleryModal";
import { CardModel } from "@/src/models/CardModel";

type Props =   {
    cardData: CardModel
    openCardView?: (cardData: CardModel) => void
}

const Card: React.FC<Props> = (props) => {
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [isShowGalleryModal, setIsShowGalleryModal] = useState(false);

  useEffect(() => {
    console.log({cardData: props.cardData})
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

  const showGalleryModal = () => {
    setIsShowGalleryModal(true);
  }

  const hideGalleryModal = () => {
    setIsShowGalleryModal(false);
  }

  return (
    <div className='flex items-center justify-center mt-4'> 
        <div className="rounded-xl border p-5 shadow-md w-9/12 bg-white">

            <div className="flex w-full items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                    <img className="h-8 w-8 rounded-full bg-slate-400" src="/images/profile.jpg" alt="" />
                    <div className="text-lg font-bold text-slate-700">{props.cardData?.autherName}</div>
                </div>
                <div className="flex items-center space-x-8">
                    <button className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">Category</button>
                    {props.cardData?.createdAt && (<div className="text-xs text-neutral-500">{(new Date(props.cardData.createdAt)).toLocaleString('he-IL', {timeZone:'Asia/Jerusalem'})}</div>)}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="mb-3 text-xl font-bold">{props.cardData?.title}</div>
                <div className="text-sm text-neutral-600">{props.cardData?.body}</div>
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

            <div>
                <div className="flex items-center justify-between text-slate-500">
                    <div className="flex space-x-4 md:space-x-8">
                        <div onClick={handleCommentClick} className="flex cursor-pointer items-center transition hover:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>Comment</span>
                        </div>
                        <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>Like</span>
                        </div>
                        <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>Price offer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
  
export default Card;
