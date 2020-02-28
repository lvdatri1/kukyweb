import axios from "axios";
import CONSTANTS from "../common/PeertalConstants";
const HOST = CONSTANTS.SERVER_API + "post?limit=10";

//@flow

const requestPosts = () => {
  return { type: "REQUEST_POSTS" };
};
export const refreshPosts = (
  accessToken,
  sortType = "TIMELINE",
  longitude = 150,
  latitude = -33,
  distanceKm = 1000
) => {
  return dispatch => {
    dispatch(resetPosts());
    const getConfig = {
      headers: {
        "access-token": accessToken,
        "Content-Type": "application/json"
      }
    };
    const from = 0;
    var hostServer =
      HOST + "&from=" + from + "&sorting=" + sortType + "&longitude=" + longitude + "&latitude=" + latitude;
    if (sortType === "LOCATION") {
      hostServer =
        HOST +
        "&from=" +
        from +
        "&sorting=" +
        sortType +
        "&longitude=" +
        longitude +
        "&latitude=" +
        latitude +
        "&distanceKm=" +
        distanceKm;
    }
    // alert(hostServer);

    return axios
      .get(hostServer, getConfig)
      .then(response => {
        //console.log(response.data.data.list);
        return dispatch(receivePosts(response.data.data, sortType));
      })
      .catch(error => {
        alert(error + "cannot refresh Post 1");
        console.log("error location", error);
        return dispatch(stopLoading());
      });
  };
};

const resetPosts = () => {
  return { type: "RESET_POSTS" };
};
const stopLoading = () => {
  return { type: "STOP_LOADING_POSTS" };
};
export const fetchPosts = (
  startX = 0,
  accessToken = "",
  sortType = "TIMELINE",
  longitude = 150.11,
  latitude = -33.33,
  distanceKm = 10000
) => {
  return dispatch => {
    dispatch(requestPosts());
    const from = startX;
    const getConfig = {
      headers: {
        "access-token": accessToken,
        "Content-Type": "application/json"
      }
    };
    var hostServer =
      HOST + "&from=" + from + "&sorting=" + sortType + "&longitude=" + longitude + "&latitude=" + latitude;
    // alert(hostServer);
    if (sortType === "LOCATION") {
      hostServer =
        HOST +
        "&from=" +
        from +
        "&sorting=" +
        sortType +
        "&longitude=" +
        longitude +
        "&latitude=" +
        latitude +
        "&distanceKm=" +
        distanceKm;
    }
    return axios
      .get(hostServer, getConfig)
      .then(response => {
        console.log("data response", response.data.data);
        return dispatch(receivePosts(response.data.data, sortType));
      })
      .catch(error => {
        alert(error + "cannot fetch Post 1");
        console.log("error location", error);
        return dispatch(stopLoading());
      });
  };
};
export const receivePosts = (data, sortType) => {
  return { type: "RECEIVE_POSTS", data: data.posts, sortType: sortType };
};

export const getPostsInProfile = (
  accessToken,
  limit = 10,
  from = 0,
  user_id,
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK
) => {
  let host = CONSTANTS.SERVER_API + "post?userId=" + user_id;
  // alert(host);
  const getConfig = {
    headers: {
      "access-token": accessToken,
      "Content-Type": "application/json"
    }
  };
  axios
    .get(host, getConfig)
    .then(res => callbackSuccess(res))
    .catch(err => callbackError(err));
};

export const getNearbyPosts = (
  accessToken,
  keyword = "",
  from = 0,
  limit = 20,
  longitude,
  latitude,
  distanceKm,
  sorting = "LOCATION",
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK
) => {
  let host =
    CONSTANTS.SERVER_API +
    "post?q=" +
    keyword +
    "&from=" +
    from +
    "&limit=" +
    limit +
    "&longitude=" +
    longitude +
    "&latitude=" +
    latitude +
    "&distanceKm=" +
    distanceKm +
    "&sorting=" +
    sorting;
  // alert(host);
  const getConfig = {
    headers: {
      "access-token": accessToken,
      "Content-Type": "application/json"
    }
  };
  axios
    .get(host, getConfig)
    .then(res => callbackSuccess(res))
    .catch(err => callbackError(err));
};

export const getPostDetails = (
  accessToken,
  postId,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK
) => {
  const host = CONSTANTS.SERVER_API + "post/" + postId;
  const postConfig = {
    headers: {
      "content-type": "application/json",
      "access-token": accessToken
    }
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const getSearchPosts = (
  accessToken,
  keyword = "",
  from = 0,
  limit = 20,
  longitude,
  latitude,
  distanceKm,
  sorting = "LOCATION",
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK
) => {
  let host =
    CONSTANTS.SERVER_API +
    "post?q=" +
    keyword +
    "&from=" +
    from +
    "&limit=" +
    limit +
    "&longitude=" +
    longitude +
    "&latitude=" +
    latitude +
    "&distanceKm=" +
    distanceKm +
    "&sorting=" +
    sorting;
  // alert(host);
  const getConfig = {
    headers: {
      "access-token": accessToken,
      "Content-Type": "application/json"
    }
  };
  axios
    .get(host, getConfig)
    .then(res => callbackSuccess(res))
    .catch(err => callbackError(err));
};
