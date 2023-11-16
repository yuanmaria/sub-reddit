import PropTypes from "prop-types";
import "./CompactComponent.css";
import { BiUpvote, BiDownvote, BiFile } from "react-icons/bi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
/**
 * Compact View List Item
 */
function CompactComponent({ item }) {
  const [score, setScore] = useState(item.score || 0);
  const navigate = useNavigate();
  const handleClick = () => {
    const permalink = item.permalink.replace("/r/StartledCats", "");
    navigate(permalink);
  };
  return (
    <div className="compact-container">
      <div className="left-container">
        <BiUpvote className="cursor" onClick={(_e) => setScore(score + 1)} />
        <div>{score || "Vote"}</div>
        <BiDownvote className="cursor" onClick={(_e) => setScore(score - 1)} />
      </div>
      <div className="right-container" onClick={handleClick}>
        <BiFile />
        <div className="title-container">
          <div className="title">{item.title}</div>
          <div className="author">
            Posted by: u/{item.author}{" "}
            {new Date(item.created * 1000).toDateString()}
          </div>
        </div>
        <div className="comment">{item.num_comments}</div>
      </div>
    </div>
  );
}

CompactComponent.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    created: PropTypes.number,
    num_comments: PropTypes.number,
    score: PropTypes.number,
    url: PropTypes.string,
  }),
};

export default CompactComponent;
