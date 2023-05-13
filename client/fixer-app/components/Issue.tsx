import { useEffect, useState } from "react"

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

  useEffect(() => {
    if(!props?.imageUrl) return;
    fetch(props.imageUrl)
      .then(response => response.blob())
      .then(imageBlob => {
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImage(imageObjectUrl);
      });
  } ,[]);

  return (
    <div className="post__container">
      <div className="post__title-container">
        <div className="text-lg text-left	font-bold	">
          {props.title}
          <img className="header__avatar" src={props.userAvatar} />
          <div>
            {props.timestamp ? (
              <p className="post__timestamp">
                {(new Date(props.timestamp)).toLocaleString('he-IL', {timeZone:'Asia/Jerusalem'}) + ` written by ${props.createdBy}`}
              </p>
            ) : (
              <p className="post__timestamp">Loading</p>
            )}
          </div>
        </div>

        <p className="post__message">{props.body}</p>
      </div>
      {props.imageUrl && (
          <img className="h-28 w-28" src={image} />
      )}

      {/* Post Footer */}
      <div className="post__footer">
        <div className="post__footer-item">
        <svg className="h-8 w-8 text-yellow-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7" /></svg>
          <p className="post__reaction">Comment</p>
        </div>
      </div>
    </div>
  );
  }
  
  export default Issue;
