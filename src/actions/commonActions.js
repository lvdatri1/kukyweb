import axios from 'axios';
import CONSTANTS from '../common/PeertalConstants';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import ContactObject from '../models/ContactObject';

export const getPageInfo = (
  pageCode = 'about',
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const serverHost = CONSTANTS.SERVER_API + 'page/' + pageCode;
  // alert(serverHost);
  axios
    .get(serverHost)
    .then(res => {
      // alert('call done');
      callBackSuccess(res);
    })
    .catch(err => callBackError(err));
};
export const getCurrentLocation = (
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 1000,
  },
) => {
  if (CONSTANTS.OS == 'android') {
    PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION')
      .then(() => {
        Geolocation.getCurrentPosition(
          position => callBackSuccess(position),
          callBackError,
          options,
        );
        // navigator.geolocation.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
      })
      .catch(e => {
        callBackError(e);
      });
  } else {
    // if ios -> just get
    // navigator.geolocation.setRNConfiguration({ skipPermissionRequests: true });
    // navigator.geolocation.requestAuthorization();
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => callBackSuccess(position),
      callBackError,
      options,
    );
    // .then(() => {
    //   navigator.geolocation.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
    // })
    // .catch(e => {
    //   callBackError(e);
    // });
  }
};
export const getLocationPermission = async () => {
  if (CONSTANTS.OS == 'android') {
    return await PermissionsAndroid.request(
      'android.permission.ACCESS_FINE_LOCATION',
    );
  } else {
    return await navigator.geolocation.requestAuthorization();
  }
};

// export const goToPage = (navigation = "post/1", link) => {
//   const id = link.split("/")[1];
//   const page = link.split("/")[0];
//   if (page == "post") {
//     navigation.navigate("PostDetails", { postId: id });
//   } else if (page == "profile") {
//     navigation.navigate("PostDetails", { postId: id });
//   }
// };
// export const goBack = navigation => {};
export const getAddressFromLocation = (
  lat,
  long,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
  const serverHost = 'https://maps.googleapis.com/maps/api/geocode/json?';
  const host =
    serverHost +
    'key=' +
    CONSTANTS.GOOGLE_API_KEY +
    '&latlng=' +
    lat +
    ',' +
    long;
  // alert(serverHost);
  axios
    .get(host)
    .then(res => {
      // alert('call done');
      if (res.data.status == 'OK') callBackSuccess(res);
      else callBackError(res);
    })
    .catch(err => callBackError(err));
};

export const reportAProblem = (
  accessToken,
  contactData = new ContactObject(),
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(CONSTANTS.SERVER_API + 'contact', contactData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
