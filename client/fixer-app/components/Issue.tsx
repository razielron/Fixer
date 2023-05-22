import { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import GalleryModal from "./GalleryModal"
import Comment from './Comment';

type Props =   {
    createdBy?: string
    title?: string
    body?: string
    timestamp?: Date
    imageUrl?: string
    userAvatar?: string
}

const Issue: React.FC<Props> =(props) => {
  const [image, setImage] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [isShowGalleryModal, setIsShowGalleryModal] = useState(false);

  useEffect(() => {
    if(!props?.imageUrl) return;
    fetch(props.imageUrl)
      .then(response => response.blob())
      .then(imageBlob => {
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImage(imageObjectUrl);
      });
  }, []);

  const showGalleryModal = () => {
    setIsShowGalleryModal(true);
  }

  const hideGalleryModal = () => {
    setIsShowGalleryModal(false);
  }

  return (
    <div className="post__container">
        <div className="post__title-container">
          <div className="text-lg text-left	font-bold pl-5 pt-5	">
            {props.title}
            <img className="header__avatar" src={props.userAvatar} />
            <div>
              {props.timestamp ? (
                <p className="post__timestamp">
                  {(new Date(props.timestamp)).toLocaleString('he-IL', {timeZone:'Asia/Jerusalem'}) + ` written by ${props.createdBy}`}
                </p>
              )
              : (
                <p className="post__timestamp">Loading</p>
              )}
            </div>
          </div>
  
          <p className="post__message pl-5">{props.body}</p>
        </div>
      {props.imageUrl && !isShowGalleryModal && (
          <div className="flex content-center w-full">
           <img onClick={showGalleryModal} className="h-28 w-28 pl-5" src={image} />
          </div>
      )}
      {props.imageUrl && isShowGalleryModal && (
           <GalleryModal hideModal={hideGalleryModal} imageArray={[image,image,image]}/>
      )}

      {/* Post Footer */}
      <div className="post__footer">
        <div className="post__footer-item flex items-center flex-col ">
          <svg className="h-8 w-8 text-yellow-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7" /></svg>
          <button onClick={() => setShowComment(true)} className="post__reaction">Comment</button>
          {showComment && <Comment comment={{}} ></Comment>}
        </div>
      </div>
    </div>
  );
}
  
  export default Issue;
