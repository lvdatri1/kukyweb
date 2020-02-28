import axios from 'axios';
import {StackActions} from 'react-navigation';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import firebase from 'react-native-firebase';
import CONSTANTS from '../common/PeertalConstants';
import BankAccountObject from '../models/BankAccountObject';

export const getDeviceFirebaseToken = (
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  firebase
    .messaging()
    .getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        callBackSuccess(fcmToken);
      } else {
        // user doesn't have a device token yet
        callBackError(fcmToken);
      }
    });
};
export const requestRegisterUserViaEmail = () => {
  return {type: 'REQUEST_REGISTER_USER_VIA_EMAIL'};
};

export const shareSimplePost = (accessToken, shareContent, callBackAction) => {
  const postData = {
    // accessToken: this.props.user.accessToken,
    content: shareContent,
    isPublic: true,
    isIncognito: false,
    // longitude: '150.91548093216775',
    // latitude: '-33.78119359760677',
  };
  // console.log('post before share', postData);
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'Access-Token': accessToken,
      // 'accessToken': 'b7ec648b3faed30fc12051ef98703600',
    },
  };
  // this.setState({ ...this.state, isLoading: true, modalVisible: false })
  axios
    .post(CONSTANTS.SERVER_API + 'post', postData, postConfig)
    .then(response => {
      callBackAction(response);
    })
    .catch(err => {
      alert(err);
    });
};

export const loginViaEmailOrSMS = (
  loginId,
  type,
  devicePushToken,
  callBackSuccess,
  callBackError,
) => {
  const apiData = {
    username: loginId,
    type: type,
    devicePushToken: devicePushToken,
    deviceType: CONSTANTS.OS,
    deviceVersion: CONSTANTS.OS_VERSION,
  };
  axios
    .post(CONSTANTS.SERVER_API + 'login', apiData)
    .then(res => {
      // console.log('login successsfully', res.data);
      // alert(res.data);
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};

export const loginViaSocial = (
  token = 'xxx',
  provider = 'Facebook',
  profile = {email: 'abc@gmail.com', fullName: 'TT TT'},
  devicePushToken,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const apiData = {
    token: token,
    provider: provider,
    profile: profile,
    deviceType: CONSTANTS.OS,
    deviceVersion: CONSTANTS.OS_VERSION,
    devicePushToken: devicePushToken,
  };
  axios
    .post(CONSTANTS.SERVER_API + 'login-by-social', apiData)
    .then(res => {
      // console.log('login successsfully', res.data);
      // alert(res.data);
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const loginCodeInput = (email, code, callBackSuccess, callBackError) => {
  //change loginId to username
  const apiData = {
    username: email,
    code: code,
  };
  axios
    .post(CONSTANTS.SERVER_API + 'code', apiData)
    .then(res => {
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const createCommentOnAPost = (
  accessToken,
  commentData = {
    content: 'test content',
    objectId: 390,
    objectType: 'POST',
    parentCommentId: 0,
    isIncognito: false,
  },
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
      // 'accesstoken': 'b7ec648b3faed30fc12051ef98703600',
    },
  };
  const postData = commentData;
  axios
    .post(CONSTANTS.SERVER_API + 'comment', postData, postConfig)
    .then(res => {
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const uploadBigFileToS3 = (
  accessToken,
  image,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
  uploadProgress,
) => {
  let mediaType = {
    contentType: image.mime,
    width: image.width,
    height: image.height,
  };
  getUploadUrl(accessToken, mediaType, res => {
    let uploadUrl = res.data.data.uploadUrl;
    RNFS.readFile(image.path, 'base64')
      .then(data => {
        let originalData = new Buffer.from(data, 'base64');
        const postConfig = {
          headers: {
            'content-type': image.mime,
          },
          onUploadProgress: uploadProgress,
        };
        axios
          .put(uploadUrl, originalData, postConfig)
          .then(() => {
            callBackSuccess(res);
          })
          .catch(err => {
            callBackError(err);
          });
      })
      .catch(err => callBackError(err));
  });
};
export const uploadMediaForPost = (
  accessToken,
  mediaFileURI,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
  uploadProgress = {},
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/form-data',
      onUploadProgress: uploadProgress,
      'access-token': accessToken,
    },
  };
  const postData = new FormData();
  postData.append('file', {
    uri: mediaFileURI,
    type: 'image/jpeg',
    name: 'PeertalMediaUpload',
  });
  // alert(accessToken);
  axios
    .post(CONSTANTS.SERVER_API + 'file', postData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(error => callBackError(error));
};
export const shareFullPost = (
  accessToken,
  postData = {
    content: 'blank',
    longitude: '150.001',
    latitude: '-33.2222',
    media: [],
    tags: [],
    isPublic: true,
    isIncognito: false,
  },
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  // alert("user token is" + accessToken); // uncomment this line to check access token
  axios
    .post(CONSTANTS.SERVER_API + 'post', postData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const updatePost = (
  accessToken,
  postData = {
    id: '1',
    content: 'blank',
    longitude: '150.001',
    latitude: '-33.2222',
    media: [],
    tags: [],
    isPublic: true,
    isIncognito: false,
  },
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  // alert("user token is" + accessToken); // uncomment this line to check access token
  axios
    .put(CONSTANTS.SERVER_API + 'post/' + postData.id, postData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const voteToPost = (
  accessToken,
  voteData = {
    id: '',
    value: 'LIKE',
    type: 'POST',
  },
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
    .post(CONSTANTS.SERVER_API + 'vote', voteData, postConfig)
    .then(res => {
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const reportToPost = (
  accessToken,
  reportData = {
    id: 1,
    type: 'POST',
    value: 'report', // or nsfw
  },
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
    .post(
      CONSTANTS.SERVER_API + (reportData.value == 'nsfw' ? 'nsfw' : 'report'),
      reportData,
      postConfig,
    )
    .then(res => {
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const reportToPerson = (
  accessToken,
  reportData = {
    id: 1,
    type: 'USER',
    value: 'report', // or nsfw
  },
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
    .post(
      CONSTANTS.SERVER_API + (reportData.value == 'nsfw' ? 'nsfw' : 'report'),
      reportData,
      postConfig,
    )
    .then(res => {
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const blockToPerson = (
  accessToken,
  reportData = {
    id: 1,
    type: 'USER',
    value: 'block', // or nsfw
  },
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
    .post(CONSTANTS.SERVER_API + 'report', reportData, postConfig)
    .then(res => {
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const registerViaEmail = (
  email,
  fullName,
  callBackSuccess,
  callBackError,
) => {
  const apiData = {
    username: email,
    type: 'email',
    full_fame: fullName,
    device_token: 'testDeviceId',
    device_type: CONSTANTS.OS,
    device_version: CONSTANTS.OS_VERSION,
  };
  axios
    .post(CONSTANTS.SERVER_API + 'register', apiData)
    .then(res => {
      // console.log('login successsfully', res.data);
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const registerWithBase64 = (
  userData = {
    username: 'lvd@gmail.com',
    type: 'email',
    full_name: 'trinh le',
    avatar_base64: 'data:image/pgn;base64 ,ddfdvdvs',
    device_token: 'testdevice',
  },
  callBackSuccess,
  callBackError,
) => {
  const apiData = {
    username: userData.username,
    type: userData.type,
    full_name: userData.full_name,
    avatar_base64: userData.avatar_base64,
    device_token: userData.device_token,
    device_type: CONSTANTS.OS,
    device_version: CONSTANTS.OS_VERSION,
  };
  axios
    .post(CONSTANTS.SERVER_API + 'register', apiData)
    .then(res => {
      console.log('register successsfully', res.data);
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};
export const requestToReceivePushPermission = () => {
  firebase
    .messaging()
    .hasPermission()
    .then(enabled => {
      if (enabled) {
        // user has permissions
        console.log('ok good');
      } else {
        // user doesn't have permission
        firebase
          .messaging()
          .requestPermission()
          .then(() => {
            // User has authorised
            //alert('Thank you! now you can receive push message');
          })
          .catch(error => {
            // User has rejected permissions
            alert('good luck, see you next time');
          });
      }
    });
};
export const registerNewUserWithAvatar = (
  user = {
    fullName: '',
    loginId: '',
    devicePushToken: '',
    deviceType: '',
    deviceVersion: '',
    type: '',
    avatar: '',
  },
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  var postData = new FormData();
  postData.append('avatar', {
    uri: user.avatar,
    type: 'image/jpeg',
    name: 'PeertalMediaUpload',
  });
  postData.append('fullName', user.fullName);
  postData.append('loginId', user.loginId);
  postData.append('devicePushToken', user.devicePushToken);
  postData.append('deviceType', user.deviceType);
  postData.append('type', user.type);
  let accessToken = '';
  const postConfig = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'access-token': accessToken,
    },
  };
  axios
    .post(CONSTANTS.SERVER_API + 'register', postData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(error => callBackError(error));
};
/**
 * @description: upload media file to server
 * @param: mediaFieleURI is file location in server.
 *
 */
export const uploadMediaToPeertal = (
  accessToken,
  mediaFileData,
  place = 'post',
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
  uploadProgress = {},
) => {
  const apiData = {
    base64: mediaFileData,
  };
  const postConfig = {
    headers: {
      'access-token': accessToken,
      onUploadProgress: uploadProgress,
      // "content-type": "application/x-www-form-urlencoded"
    },
  };
  axios
    .post(CONSTANTS.SERVER_API + 'file', apiData, postConfig)
    .then(res => {
      console.log('register successfully', res.data);
      callBackSuccess(res);
    })
    .catch(err => {
      callBackError(err);
    });
};

export const voteCharacter = (
  accessToken,
  userId,
  character,
  callBackSuccess,
  callbackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'vote-character';
  const apiData = {id: userId, value: character};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callbackError(err));
};
export const getMyProfile = (
  accessToken,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'myProfile';
  // const apiData = { id: userId, value: character };
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const addSkill = (
  accessToken,
  userId,
  skillName,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'user/' + userId + '/skill';
  const apiData = {name: skillName};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const updateMySettings = (
  accessToken,
  userId = 1,
  settings,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'user/' + userId + '/settings';
  const apiData = settings;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .put(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const getMySettings = (
  accessToken,
  userId = 1,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'user/' + userId + '/settings';
  //const apiData = settings;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const updateMyAvatar = (
  accessToken,
  userId = 1,
  base64,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'user/' + userId + '/avatar';
  let apiData;
  if (base64.startsWith('data')) apiData = {base64: base64};
  else apiData = {base64: 'data:image/png;base64,' + base64};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .put(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const updateMyBackground = (
  accessToken,
  userId = 1,
  base64,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'user/' + userId + '/background';
  let apiData;
  if (base64.startsWith('data')) apiData = {base64: base64};
  else apiData = {base64: 'data:image/png;base64,' + base64};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .put(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getUploadUrl = (
  accessToken,
  mediaData,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'getS3UploadUrl';
  let apiData = mediaData;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getAllNotifications = (
  accessToken,
  callBackSuccess,
  callBackError,
) => {
  const host = CONSTANTS.SERVER_API + 'notification';
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getWalletDetails = (
  accessToken,
  callBackSuccess,
  callBackError,
) => {
  const host = CONSTANTS.SERVER_API + 'wallet';
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getWalletTransactions = (
  accessToken,
  type = 'all',
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'transaction?type=' + type;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const sendMoney = (
  accessToken,
  amount,
  tags = [1, 2],
  reason = 'message',
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'send-money';
  let apiData = {
    amount: amount,
    tags: tags,
    reason: reason,
  };
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const addACard = (
  accessToken,
  cardData = {
    type: 'visa',
    fullName: 'NGUYEN VAN A',
    cardNumber: '4242424242424242',
    expiryDate: {
      month: 1,
      year: 2020,
    },
    cvc: '123',
    cardBillingCountry: 'string',
    cardBillingAddress: 'string',
  },
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'card';
  let apiData = cardData;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const goToProfile = (navigation, userId) => {
  const pushAction = StackActions.push({
    routeName: 'UserProfile',
    params: {
      userId: userId,
    },
  });
  navigation.dispatch(pushAction);
};

export const goToPage = (navigation, routeName, params = {}) => {
  const pushAction = StackActions.push({
    routeName: routeName,
    params: params,
  });
  navigation.dispatch(pushAction);
};
export const goToLink = (navigation, link) => {
  const arr = link.split('/');
  const page = arr[1];
  const param = arr[2];
  if (page == 'profile' || page == 'user') {
    goToPage(navigation, 'UserProfile', {userId: param});
    return;
  }
  if (page == 'post') {
    goToPage(navigation, 'PostDetails', {postId: param});
    return;
  }
  if (page == 'chat') {
    goToPage(navigation, 'ChatControl', {chatObject: param});
  }
};

export const topUpCard = (
  accessToken,
  cardId,
  amount,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'top-up';
  let apiData = {amount: amount, cardId: cardId};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const readAllNotifications = (
  accessToken,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'notification';
  let apiData = {};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .put(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
export const deleteAllNotifications = (
  accessToken,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'notification';
  let apiData = {};
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .delete(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const addABank = (
  accessToken,
  bankAccount = new BankAccountObject(),
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'bank-account';
  let apiData = bankAccount;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getMoneyRequest = (
  accessToken,
  from = 0,
  limit = 10,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'request-money';
  // let apiData = bankAccount;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const createMoneyRequest = (
  accessToken,
  requestData = {amount: 0, tags: [1], reason: 'need money for beer'},
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'request-money';
  const apiData = requestData;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getBankAccounts = (
  accessToken,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'bank-account';
  // let apiData = bankAccount;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .get(host, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const cashOutMoney = (
  accessToken,
  requestData = {amount: 0, currency: 'USD', reason: '', bankAccountId: 1},
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const host = CONSTANTS.SERVER_API + 'cash-out';
  const apiData = requestData;
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios
    .post(host, apiData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
