import { PriceOfferModel } from "@/src/models/priceOfferModel";
import router from "next/router";

interface Props {
    priceOffer: PriceOfferModel
}

const PriceOffer: React.FC<Props> = (props) => {
    const openProfile = () => {
        if(!props.priceOffer?.autherId) return;
        router.push(`/profile/${props.priceOffer?.autherId}`);
    }

    return (
        <>
            <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 mb-0 text-sm text-gray-900 cursor-pointer" onClick={openProfile}>
                            <img
                                className="mr-2 w-12 h-12 rounded-full"
                                src={props.priceOffer.autherPhotoUrl || "/images/profile.jpg"}// to fix - add avatar props on PriceOfferModel
                                alt="Michael Gough"/>{props.priceOffer.autherName}</p>
                        <p className="text-sm text-gray-600 mb-0">
                            {(new Date(props.priceOffer.createdAt || '')).toLocaleString('he-IL', {timeZone:'Asia/Jerusalem'})}
                        </p>
                    </div>
                    <button id="dropdownPriceOffer1Button" data-dropdown-toggle="dropdownPriceOffer1"
                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        type="button">
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                            </path>
                        </svg>
                        <span className="sr-only">PriceOffer settings</span>
                    </button>
                    <div id="dropdownPriceOffer1"
                        className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownMenuIconHorizontalButton">
                            <li>
                                <a href="#"
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                            <li>
                                <a href="#"
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                            </li>
                            <li>
                                <a href="#"
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                            </li>
                        </ul>
                    </div>
                </footer>
                <p className="text-gray-500 dark:text-gray-400">
                    {`Price: ${props.priceOffer.price?.toString()}`}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                    {props.priceOffer.body}
                </p>
            </article>
        </>
    );
  }
  export default PriceOffer;