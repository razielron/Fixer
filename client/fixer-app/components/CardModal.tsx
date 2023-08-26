import React, { useEffect, useState } from "react";
import Card from "./Card";
import Comment from './Comment';
import CommentForm from './CommentForm';
import { CommentModel } from "@/src/models/commentModel";
import { CardModel } from "@/src/models/CardModel";
import { getCookie } from "cookies-next";

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

  let handleNewComment = async (comment: CommentModel) => {
    if(!props.cardData?.autherId || !props.cardData?.id) return;
    await props.createComment(comment, props.cardData.autherId, props.cardData.id);
    let updatedComments = await props.getComments(props.cardData.id);
    setComments(updatedComments);
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
        <div className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative mx-auto w-[60vw]">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
                    {/*header*/}
                    <div className="flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                        <button onClick={props.hideModal} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/*body*/}
                    <div className="relative flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 6rem)' }}> {/* Adjust the maxHeight as needed */}
                        <Card cardData={props.cardData} isModalOpen={false} />
                        <div className="overflow-auto pl-5">
                            {comments &&
                            comments
                                .sort((x, y) => sortByCreatedAt(x.createdAt, y.createdAt, false))
                                .map((comment) => (<Comment comment={comment} />))
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