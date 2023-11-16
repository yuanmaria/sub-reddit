import React, { useCallback, useEffect, useState } from "react";
import "./HomeContainer.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsLastPage,
  setSorting,
  setSubRedditList,
  setSubRedditRequest,
  setViewMode,
} from "../../reducers/redditSlice";
import SubRedditService from "../../services/SubRedditServices";
import CardComponent from "./components/CardComponent/CardComponent";
import ClassicComponent from "./components/ClassicComponent/ClassicComponent";
import CompactComponent from "./components/CompactComponent/CompactComponent";

const HomeContainer = () => {
  const { viewMode, subredditRequest, subredditList, isLastPage } = useSelector(
    (state) => state.reddit
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSubRedditList = useCallback((req, prev = []) => {
    setIsLoading(true);
    setError(null);

    SubRedditService.getSubRedditList(req)
      .then((res) => {
        if (res.data.after === null) {
          dispatch(setIsLastPage(true));
        }
        dispatch(setSubRedditRequest({ after: res.data.after }));
        dispatch(setSubRedditList([...prev, ...res.data.children]));
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching subreddit data:", error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getSubRedditList();
  }, [getSubRedditList]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    if (!isLastPage) {
      getSubRedditList(subredditRequest, subredditList);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  const handleSortingChange = (newSorting) => {
    dispatch(setSorting(newSorting));
    dispatch(setIsLastPage(false));
    dispatch(setSubRedditList([]));
    const request = {
      after: null,
      sort: newSorting,
    };
    dispatch(setSubRedditRequest(request));
    getSubRedditList(request);
  };

  const handleViewModeChange = (newViewMode) => {
    dispatch(setViewMode(newViewMode));
  };

  const renderViewComponent = () => {
    let ViewComponent = CardComponent;
    switch (viewMode) {
      case "card":
        ViewComponent = CardComponent;
        break;
      case "classic":
        ViewComponent = ClassicComponent;
        break;
      case "compact":
        ViewComponent = CompactComponent;
        break;
      default:
        break;
    }
    return (
      subredditList.length > 0 &&
      subredditList.map((item) => {
        return <ViewComponent item={item.data} key={item.data.id} />;
      })
    );
  };

  return (
    <div className="home-container">
      <div className="filter">
        <div className="filter-item">
          <label>Sort by:</label>
          <select
            className="filter-select"
            value={subredditRequest.sort}
            onChange={(e) => handleSortingChange(e.target.value)}
          >
            <option value="hot">Hot</option>
            <option value="new">New</option>
            <option value="top">Top</option>
          </select>
        </div>
        <div className="filter-item">
          <label>View mode:</label>
          <select
            className="filter-select"
            value={viewMode}
            onChange={(e) => handleViewModeChange(e.target.value)}
          >
            <option value="card">Card</option>
            <option value="classic">Classic</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>
      <div className={`${viewMode}-item`}>{renderViewComponent()}</div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default HomeContainer;
