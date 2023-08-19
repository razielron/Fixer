import React, { useEffect, useState } from "react";
import Card from "./Card";
import Comment from './Comment';
import CommentForm from './CommentForm';
import { CommentModel } from "@/src/models/commentModel";
import { CardModel } from "@/src/models/CardModel";
import { getCookie } from "cookies-next";
import { ApiResponseModel } from "@/src/models/apiModel";

type Props =   {
    commentArray?: CommentModel[]
    cardData: CardModel
    getComments: (cardId: string) => Promise<CommentModel[]>
    createComment: (comment: CommentModel, autherId: string, cardId: string) => Promise<CommentModel>
    hideModal: () => void
}


const CardModal: React.FC<Props> = (props) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};

  let handleNewComment = (comment: CommentModel) => {
    if(!props.cardData?.autherId || !props.cardData?.id) return;
    props.createComment(comment, props.cardData.autherId, props.cardData.id)
        .then((createdComment) => {
            setComments([...comments, createdComment]);
        });
  }

  let sortByCreatedAt = (x: Date | undefined, y: Date | undefined, orderAscending: boolean) : number => {
    let order = orderAscending ? 1 : -1;
    let firstDate: number = x ? (new Date(x)).getTime() : Date.now();
    let secondDate: number = y ? (new Date(y)).getTime() : Date.now();

    return (secondDate - firstDate) * order;
  }

  useEffect(() => {
    if(!props.cardData?.id) return;
    props.getComments(props.cardData.id)
        .then((comments:CommentModel[]) => {
            setComments(comments);
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
                        {comments &&
                            comments
                                .sort((x, y) => sortByCreatedAt(x.createdAt, y.createdAt, false))
                                .map((comment) => 
                                    (<Comment comment={comment} />)
                                )
                        }
                        </div>
                        <div className="">
                        <CommentForm onSubmit={handleNewComment} />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div onClick={props.hideModal} className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CardModal;