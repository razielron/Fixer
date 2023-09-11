import { CommentModel } from "@/src/models/commentModel";
import router from "next/router";

interface Props {
    id: number;
    title: string;
    stars: number;
    price: number;
    currency: string;
    photoUrl: string;
    onPurchase: (id: number) => void;
}

const Item: React.FC<Props> = (props: Props) => {
    const starsArray = new Array(Math.floor(props.stars)).fill(0);
    const leftOverStars = new Array(5 - starsArray.length).fill(0);

    return (
        <>
            
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                <a href="#">
                    <img className="p-8 rounded-t-lg object-scale-down h-48 w-96" src={props.photoUrl} alt="product image" />
                </a>
                <div className="px-5 pb-5">
                    <a href="#">
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900">{props.title}</h5>
                    </a>
                    <div className="flex items-center mt-2.5 mb-5">
                        {starsArray.map(x => (
                            <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                        ))}
                        {leftOverStars.map(x => (
                            <svg className="w-4 h-4 text-gray-200 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                        ))}
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-3">{props.stars}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-900">{`${props.currency}${props.price}`}</span>
                        <button onClick={() => props.onPurchase(props.id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Purchase</button>
                    </div>
                </div>
            </div>

        </>
    );
  }
  export default Item;