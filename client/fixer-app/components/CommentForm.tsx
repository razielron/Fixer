import { useState } from "react";
import { CommentModel } from "@/src/models/commentModel";

interface CommentProps{
    onSubmit: (comment: CommentModel) => void;
}

const CommentForm: React.FC<CommentProps> = (props) => {
    const [comment, setComment] = useState('');

    let handleSubmit = () => {
        let commentModel: CommentModel = {
            body: comment,
        }
        props.onSubmit(commentModel);
        setComment('');
    }

    return (
        <div className="hero bg-gredient-dark h-400px flex flex-col px-2">
            <form className="flex flex-row">
                <input onChange={(event:any)=> setComment(event.target.value)} className="rounded mb-2 h-16 bg-gray-100 text-grey-darker py-2 font-normal text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-lg text-gray-600" type="text" placeholder="Type Your Comment"/>
                <span className="mb-2 flex items-center bg-gray-100 rounded rounded-l-none border-0 px-3 font-bold text-grey-100">
                    <button onClick={handleSubmit} type="submit" className="bg-gredient-dark hover:bg-gredient-light text-lg text-white font-bold py-3 px-6 rounded">
                        <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="blue" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                        </svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </span>
            </form>
        </div>
    );
}

export default CommentForm;