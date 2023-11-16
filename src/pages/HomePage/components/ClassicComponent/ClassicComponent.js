import PropTypes from "prop-types";
import "./ClassicComponent.css";
import { BiUpvote, BiDownvote, BiFile } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
/**
 * Classic View List Item
 */
function ClassicComponent({ item }) {
  const [score, setScore] = useState(item.score || 0);
  const navigate = useNavigate();
  const handleClick = () => {
    const permalink = item.permalink.replace("/r/StartledCats", "");
    navigate(permalink);
  };
  return (
    <div className="classic-container">
      <div className="left-container">
        <BiUpvote className="cursor" onClick={(_e) => setScore(score + 1)} />
        <div>{score || "Vote"}</div>
        <BiDownvote className="cursor" onClick={(_e) => setScore(score - 1)} />
      </div>
      <div className="right-container" onClick={handleClick}>
        <div className="thumbnail-container">
          {item.thumbnail === "self" ? (
            <div className="no-thumbnail">
              <BiFile />
            </div>
          ) : (
            <div
              className="thumbnail"
              style={{
                backgroundImage: `url(${item.thumbnail.replace(
                  /&amp;/g,
                  "&"
                )})`,
              }}
            ></div>
          )}
        </div>
        <div className="content-container">
          <div className="title">{item.title}</div>
          <div className="author">
            Posted by: u/{item.author}{" "}
            {new Date(item.created * 1000).toDateString()}
          </div>
          <div className="comment">{item.num_comments} Comments</div>
        </div>
        {/* <a href={item.url}>comment</a> */}
      </div>
    </div>
  );
}

ClassicComponent.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    created: PropTypes.number,
    num_comments: PropTypes.number,
    score: PropTypes.number,
    url: PropTypes.string,
    thumbnail: PropTypes.string,
  }),
};

export default ClassicComponent;
