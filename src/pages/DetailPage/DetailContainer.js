import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SubRedditServices from "../../services/SubRedditServices";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import "./DetailContainer.css";
import CommentComponent from "./components/CommentComponent";

function DetailContainer() {
  const location = useLocation();
  const { pathname } = location;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subredditDetail, setSubredditDetail] = useState({});
  const [commentDetail, setCommentDetail] = useState([]);
  const [score, setScore] = useState(0);

  const getSubRedditDetail = useCallback(() => {
    setIsLoading(true);
    setError(null);

    SubRedditServices.getSubRedditDetail(pathname)
      .then((res) => {
        setSubredditDetail(res[0].data.children[0].data);
        setScore(res[0].data.children[0].data.score || 0);
        if (res[1]) generateComment(res[1].data.children);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching subreddit detail data:", error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pathname]);

  useEffect(() => {
    getSubRedditDetail();
  }, [getSubRedditDetail]);

  const generateComment = (comment) => {
    setCommentDetail(comment);
  };

  const displayMedia = () => {
    if (
      subredditDetail.secure_media &&
      subredditDetail.secure_media.reddit_video
    ) {
      return (
        <video width={750} height={376} controls className="video-container">
          <source
            src={subredditDetail.secure_media.reddit_video.hls_url}
            type="application/x-mpegURL"
          />
          <source
            src={subredditDetail.secure_media.reddit_video.fallback_url}
            type="video/mp4"
          />
        </video>
      );
    }
    if (subredditDetail.secure_media && subredditDetail.secure_media.oembed) {
      return (
        <div className="embed-container">
          <a href={subredditDetail.url}>{subredditDetail.url}</a>
          <div
            dangerouslySetInnerHTML={{
              __html: htmlDecode(subredditDetail.secure_media.oembed.html),
            }}
          ></div>
        </div>
      );
    }
    if (subredditDetail.is_gallery) {
      return (
        <div>
          Currently gallery view is not supported{" "}
          <a href={subredditDetail.url}>{subredditDetail.url}</a>
        </div>
      );
    }
    if (subredditDetail.is_reddit_media_domain) {
      return (
        <img width={500} src={subredditDetail.url} alt={subredditDetail.url} />
      );
    }
    if (subredditDetail.url && subredditDetail.preview) {
      return (
        <div className="embed-container">
          <a href={subredditDetail.url}>{subredditDetail.url}</a>
          <img
            width={500}
            src={subredditDetail.url.replace("gifv", "gif")}
            alt={subredditDetail.url}
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

  if (isLoading) {
    return <div>Loading ....</div>;
  } else {
    return (
      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-title">
            r/StartledCats •{" "}
            <span>
              {new Date(subredditDetail.created * 1000).toDateString()}
            </span>
          </div>
          <div className="author">{subredditDetail.author}</div>
        </div>
        <div className="content-title">{subredditDetail.title}</div>
        {displayMedia()}
        <div className="detail-footer">
          <div className="vote-container">
            <BiUpvote
              className="cursor"
              onClick={(_e) => setScore(score + 1)}
            />
            <div>{score || "Vote"}</div>
            <BiDownvote
              className="cursor"
              onClick={(_e) => setScore(score - 1)}
            />
          </div>
          <div className="comment-counter">
            {subredditDetail.num_comments} Comments
          </div>
        </div>
        <div className="comments-container">
          <div className="comments-title">Comments</div>
          {commentDetail.length > 0 &&
            commentDetail.map((item) => {
              return <CommentComponent item={item.data} key={item.data.id} />;
            })}
        </div>
        {error && <p>Error: {error.message}</p>}
      </div>
    );
  }
}

export default DetailContainer;
