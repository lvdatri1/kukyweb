import axios from "axios";
import CONSTANTS from "../common/PeertalConstants";
import FilterFriendsSettingsObject from "../models/FilterFriendsSetting";
// const getConfig = { headers: { 'accesstoken': '', 'Content-Type': 'application/json' } };

const requestPeople = () => {
  return { type: "REQUEST_PEOPLE" };
};
export const refreshPeople = (accessToken = "", sorting = "TIMELINE") => {
  return dispatch => {
    dispatch(resetPeople());
    const getConfig = {
      headers: {
        "access-token": accessToken,
        "Content-Type": "application/json"
      }
    };
    let host = CONSTANTS.SERVER_API + "user?limit=10&from=0&sorting=" + sorting;
    return axios
      .get(host, getConfig)
      .then(response => {
        console.log("people lits", response.data.data);
        return dispatch(receivePeople(response.data.data.users));
      })
      .catch(error => {
        alert(error);
        return [];
      });
  };
};

const resetPeople = () => {
  return { type: "RESET_PEOPLE" };
};
export const fetchPeople = (startX = 0, accessToken = "", sorting = "TIMELINE") => {
  return dispatch => {
    dispatch(requestPeople());
    const getConfig = {
      headers: {
        "access-token": accessToken,
        "Content-Type": "application/json"
      }
    };
    let host = CONSTANTS.SERVER_API + "user?limit=10&from=" + startX + "&sorting=" + sorting;
    return axios
      .get(host, getConfig)
      .then(response => {
        console.log("data people response", response.data.data);
        return dispatch(receivePeople(response.data.data.users));
      })
      .catch(error => {
        alert(error);
        return [];
      });
  };
};
export const receivePeople = data => {
  return { type: "RECEIVE_PEOPLE", data: data };
};
export const getUserProfile = (
  accessToken,
  userId,
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK
) => {
  let host = CONSTANTS.SERVER_API + "user/" + userId;
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
export const searchUsers = (accessToken, query = "", from = 0, limit = 20, callBackSuccess, callBackError) => {
  let host = CONSTANTS.SERVER_API + "user?from" + from + "&limit=" + limit + "&q=" + query.toLowerCase();
  // const apiData = settings;
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

export const getListOfFriends = (
  accessToken,
  userId = "2",
  typeOfFriends = "friend", // 2 options: friend or suggest
  from = 0,
  limit = 20,
  callBackSuccess,
  callBackError
) => {
  let host = CONSTANTS.SERVER_API + "user/" + userId + "/" + typeOfFriends + "?from" + from + "&limit=" + limit;
  // const apiData = settings;
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
export const getListOfSuggestedFriends = (
  accessToken,
  userId = "2",
  longitude,
  latitude,
  filterSettings = new FilterFriendsSettingsObject(),
  from = 0,
  limit = 20,
  callBackSuccess,
  callBackError
) => {
  let host =
    CONSTANTS.SERVER_API +
    "user/" +
    userId +
    "/suggest" +
    "?from=" +
    from +
    "&limit=" +
    limit +
    "&longitude=" +
    longitude +
    "&latitude=" +
    latitude +
    "&status=" +
    (filterSettings.maritalStatus == "any" ? "" : filterSettings.maritalStatus) +
    "&skill=" +
    filterSettings.skills.toString() +
    "&gender=" +
    (filterSettings.gender == "any" ? "" : filterSettings.gender) +
    "&personalities=" +
    (filterSettings.selectedCharacter === -1 ? "" : indexToCharacter[filterSettings.selectedCharacter]);
  // const apiData = settings;
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

const indexToCharacter = [
  "",
  "istj",
  "istp",
  "isfj",
  "isfp",
  "intj",
  "intp",
  "infj",
  "infp",
  "estj",
  "estp",
  "esfj",
  "esfp",
  "entj",
  "entp",
  "enfj",
  "enfp"
];

export const getNearbyPeople = (
  accessToken,
  userId = "2",
  longitude,
  latitude,
  filterSettings = new FilterFriendsSettingsObject(),
  from = 0,
  limit = 20,
  callBackSuccess,
  callBackError
) => {
  let host =
    CONSTANTS.SERVER_API +
    "user/" +
    userId +
    "/nearby" +
    "?from=" +
    from +
    "&limit=" +
    limit +
    "&longitude=" +
    longitude +
    "&latitude=" +
    latitude +
    "&status=" +
    (filterSettings.maritalStatus == "any" ? "" : filterSettings.maritalStatus) +
    "&skill=" +
    filterSettings.skills.toString() +
    "&gender=" +
    (filterSettings.gender == "any" ? "" : filterSettings.gender) +
    "&personalities=" +
    (filterSettings.selectedCharacter === -1 ? "" : indexToCharacter[filterSettings.selectedCharacter]);
  // const apiData = settings;
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
//backup get nearby People
export const _ex_getNearbyPeople = (
  accessToken,
  keyword = "",
  from = 0,
  limit = 20,
  longitude,
  latitude,
  distanceKm = 100,
  sorting = "LOCAL",
  callbackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK
) => {
  let host =
    CONSTANTS.SERVER_API +
    "user?q=" +
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
