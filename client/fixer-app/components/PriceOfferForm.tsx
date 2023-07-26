import { useState } from "react";
import Input from "@/components/input";
import { PriceOfferModel } from "@/src/models/priceOfferModel";

interface PriceOfferProps{
    onSubmit: (comment: PriceOfferModel) => void;
}

const PriceOfferForm: React.FC<PriceOfferProps> = (props) => {

    const [body, setBody] = useState('');
    const [price, setPrice] = useState<Number>();
    const [error, setError] = useState('');
    
    let handleSubmit = () => {
        let priceOfferModel: PriceOfferModel = {
            price: price,
            body: body,
        }
        props.onSubmit(priceOfferModel);
        setBody('');
        setPrice(0);
    }


    return(
            
            <div className="px-10 py-10">
                <div className="flex flex-col">
                <h5 className="mb-4">Make a price offer</h5>
                    <div>
                        <p className="p-0 m-0">
                            <b className="p-0">Amount</b>
                        </p>
                    <Input
                        onChange = {(event:any)=> setPrice(event.target.value)}
                        id = "Price"
                        type = "number"
                        value = {price?.toString() ?? ""}
                        placeHolder = "amount"
                    />
                    </div>

                    <div>
                        <p className="p-0 m-0">
                            <b className="p-0">Descriptaion</b>
                        </p>
                    <Input
                        onChange = {(event:any)=> setBody(event.target.value)}
                        id = "body"
                        type = "text"
                        value = {body}
                        placeHolder = "descriptaion"
                    />
                </div>
                </div>
                <button onClick={handleSubmit} className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
                    Send price offer
                </button>
            </div>
    )
}

export default PriceOfferForm;