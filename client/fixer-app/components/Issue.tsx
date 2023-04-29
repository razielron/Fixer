import { BiCommentDetail } from 'react-icons/Bi';

type Props =   {
    createdBy?: string
    title?: string
    body?: string
    timestamp?: Date
    imageUrl?: string
    userAvatar?: string
}

const Issue: React.FC<Props> =(props) => {
    return (
      <div className="post__container">
        <div className="post__title-container">
          <div className="post__title">
            <img className="header__avatar" src={props.userAvatar} />
            <div>
              <p className="post__name">{props.createdBy}</p>
              {props.timestamp ? (
                <p className="post__timestamp">
                  11/11/12
                </p>
              ) : (
                <p className="post__timestamp">Loading</p>
              )}
            </div>
          </div>
  
          <p className="post__message">{props.body}</p>
        </div>
        {props.imageUrl && (
          <div className="post__background">
            <img src={props.imageUrl} />
          </div>
        )}
  
        {/* Post Footer */}
        <div className="post__footer">
          <div className="post__footer-item">
            <BiCommentDetail></BiCommentDetail>
            <p className="post__reaction">Comment</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Issue;
