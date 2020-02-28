import axios from "axios";
import CONSTANTS from "../common/PeertalConstants";
// const getConfig = { headers: { 'accesstoken': '', 'Content-Type': 'application/json' } };

const requestNotification = () => {
  return { type: "REQUEST_NOTIFICATION_LIST" };
};
export const refreshNotification = (accessToken = "") => {
  return dispatch => {
    dispatch(resetNotification());
    const getConfig = {
      headers: {
        "access-token": accessToken,
        "Content-Type": "application/json"
      }
    };
    let host = CONSTANTS.SERVER_API + "notification?from=0";
    return axios
      .get(host, getConfig)
      .then(response => {
        console.log("Notification lits", response.data.data);
        return dispatch(receiveNotification(response.data.data.users));
      })
      .catch(error => {
        alert(error);
        return [];
      });
  };
};

const resetNotification = () => {
  return { type: "RESET_NOTIFICATION_LIST" };
};
export const fetchNotification = (startX = 0, accessToken = "") => {
  return dispatch => {
    dispatch(requestNotification());
    const getConfig = {
      headers: {
        "access-token": accessToken,
        "Content-Type": "application/json"
      }
    };
    let host = CONSTANTS.SERVER_API + "notification?limit=10&from=" + startX;
    return axios
      .get(host, getConfig)
      .then(response => {
        // console.log("data Notification response", response.data.data);
        return dispatch(receiveNotification(response.data.data.list));
      })
      .catch(error => {
        alert(error);
        return [];
      });
  };
};
const receiveNotification = data => {
  return { type: "RECEIVE_NOTIFICATION_LIST", data: data };
};
