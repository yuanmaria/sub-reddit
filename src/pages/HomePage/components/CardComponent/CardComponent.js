import PropTypes from "prop-types";
import "./CardComponent.css";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
/**
 * Card View List Item
 */
function CardComponent({ item }) {
  const [score, setScore] = useState(item.score || 0);
  const navigate = useNavigate();
  const handleClick = () => {
    const permalink = item.permalink.replace("/r/StartledCats", "");
    navigate(permalink);
  };

  //TODO: Move to Util
  const displayMedia = () => {
    if (item.secure_media && item.secure_media.reddit_video) {
      return (
        <video
          width={500} height={300}
          preload="none"
          poster={item.thumbnail}
          controls
          onClick={(e) => e.stopPropagation()}
        >
          <source
            src={item.media.reddit_video.hls_url}
            type="application/x-mpegURL"
          />
          <source src={item.media.reddit_video.fallback_url} type="video/mp4" />
        </video>
      );
    }
    if (item.secure_media && item.secure_media.oembed) {
      return (
        <div className="embed-container">
          <a href={item.url}>{item.url}</a>
          <div
            dangerouslySetInnerHTML={{
              __html: htmlDecode(item.secure_media.oembed.html),
            }}
            onClick={(e) => e.stopPropagation()}
          ></div>
        </div>
      );
    }
    if (item.is_gallery) {
      return (
        <div>
          Currently gallery view is not supported{" "}
          <a href={item.url}>{item.url}</a>
        </div>
      );
    }
    if (item.is_reddit_media_domain) {
      return (
        <img width={500} src={item.url} alt={item.url} />
      );
    }
    if (item.url && item.preview) {
      return (
        <div className="embed-container">
          <a href={item.url}>{item.url}</a>
          <img
            width={500}
            src={item.url.replace("gifv", "gif")}
            alt={item.url}
          />
        </div>
      );
    }
  };

  const htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  return (
    <div className="card-container">
      <div className="left-container">
        <BiUpvote className="cursor" onClick={(_e) => setScore(score + 1)} />
        <div>{score || "Vote"}</div>
        <BiDownvote className="cursor" onClick={(_e) => setScore(score - 1)} />
      </div>
      <div className="right-container" onClick={handleClick}>
        <div className="author">
          Posted by: u/{item.author}{" "}
          {new Date(item.created * 1000).toDateString()}
        </div>
        <div className="title">{item.title}</div>
        {displayMedia()}
        <div className="comment">{item.num_comments} Comments</div>
      </div>
    </div>
  );
}

CardComponent.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    created: PropTypes.number,
    num_comments: PropTypes.number,
    score: PropTypes.number,
    url: PropTypes.string,
  }),
};

export default CardComponent;
