import React, { useEffect, useState } from "react";
import Card from "./Card";
import Comment from './Comment';
import CommentForm from './CommentForm';
import { CommentModel } from "@/src/models/commentModel";
import { CardModel } from "@/src/models/CardModel";

type Props =   {
    commentArray?: CommentModel[]
    cardData: CardModel
    getComments?: (cardId: string) => Promise<CommentModel[]>
    createComment?: (comment: CommentModel, autherId: string, cardId: string) => Promise<CommentModel>
    hideModal?: () => void
}
let commentModel = {
    body: 'hello im ajajajaj ajjajaja jajajaj jajaja jajaja'
}

const CardModal: React.FC<Props> = (props) => {
  const [comments, setComments] = useState<CommentModel[]>([]);

  let handleNewComment = (comment: CommentModel) => {
    if(!props.cardData?.autherId || !props.cardData?.id) return;
    // props.createComment(comment, props.cardData.autherId, props.cardData.id)
    //     .then((createdComment) => {
    //         setComments([...comments, createdComment]);
    //     });
  }

  useEffect(() => {
    if(!props.cardData?.id) return;
    setComments([commentModel])
    // props.getComments(props.cardData.id)
    //     .then((comments) => {
    //         setComments(comments);
    //     });
  }, []);
  
  return (
    <>
        <div className="mt-24 justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <button onClick={props.hideModal}>X</button>
                        <Card cardData={props.cardData} />
                        <CommentForm onSubmit={handleNewComment} />
                        {comments && comments.map((comment) => (<Comment comment={comment} />))}
                    </div>
                </div>
            </div>
        </div>
        <div onClick={props.hideModal} className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CardModal;