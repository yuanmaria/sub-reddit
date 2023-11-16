import { useState } from "react";
import "./CommentComponent.css";
import { BiUpvote, BiDownvote, BiSolidArrowFromLeft } from "react-icons/bi";
/**
 * Comment List Item
 */
function CommentComponent({ item, isReply }) {
  const [score, setScore] = useState(item.score || 0);
  return (
    <div className="comment-container">
      <div className="comment-author">
        {isReply && <BiSolidArrowFromLeft />}
        {item.author}
        <span> • {new Date(item.created * 1000).toDateString()}</span>
      </div>
      <div className={isReply && "comment-content"}>
        <div className="comment">{item.body}</div>
        <div className="vote-container">
          <BiUpvote className="cursor" onClick={(_e) => setScore(score + 1)} />
          <div>{score || "Vote"}</div>
          <BiDownvote
            className="cursor"
            onClick={(_e) => setScore(score - 1)}
          />
        </div>
        <div className="reply-container">
          {item.replies &&
            item.replies.data.children.map((val) => {
              return (
                <CommentComponent item={val.data} key={val.data.id} isReply />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default CommentComponent;
