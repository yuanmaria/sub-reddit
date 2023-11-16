const baseUrl = "https://www.reddit.com/r/StartledCats";
const getSubRedditList = (params) => {
    const queryParams = new URLSearchParams(params);
    const url = `${baseUrl}/${params?.sort || ''}.json?${queryParams}`;

    return fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching subreddit data:", error);
        throw error; // Propagate the error to the calling code
      });
  }
const getSubRedditDetail = (commentUrl) => {
    const url = `${baseUrl}${commentUrl}.json`;

    return fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching subreddit data:", error);
        throw error; // Propagate the error to the calling code
      });
  }


const SubRedditService = {
  getSubRedditList,
  getSubRedditDetail,
};

export default SubRedditService;
