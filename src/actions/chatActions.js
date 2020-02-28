import CONSTANTS from '../common/PeertalConstants';
import SendBird from 'sendbird';
import ChatControlScreen from '../screens/ChatControlScreen';

export const initChatConnectionToSendBird = (userId, userName, avatarUrl) => {
  let sb = new SendBird({appId: CONSTANTS.SEND_BIRD.APP_ID});
  sb.connect(userId, (user, error) => {
    if (error) {
      alert('error at connect to Chat server');
      return;
    }
    console.log('user is connected', user);
    if (user.nickname == '') {
      sb.updateCurrentUserInfo(userName, avatarUrl, (res, error) => {
        if (error) {
          alert('error at updating user avatar');
        }
      });
    }
  });
};
export const enterGroupChannel = (sb, CHANNEL_ID, updateMessageFunction) => {
  registerChannel(sb, CHANNEL_ID, updateMessageFunction);
};
export const enterChannel = (
  sb,
  channelObject,
  callbackSuccess,
  callbackError,
  CHANNEL_ID,
  updateMessageFunction,
) => {
  channelObject.enter(function(response, error) {
    if (error) {
      return callbackError(error);
    }
    callbackSuccess(response);
    registerChannel(sb, CHANNEL_ID, updateMessageFunction);
  });
};
export const enterChannelURL = (
  sb,
  channelUrl,
  callbackSuccess,
  callbackError,
  CHANNEL_ID,
  updateMessageFunction,
) => {
  alert('channel is', channelUrl);
  sb.GroupChannel.getChannel(channelUrl, function(openChannel, error) {
    if (error) {
      return callbackError(error);
    }
    let resChan, resRes;
    resChan = openChannel;
    resChan.enter(function(response, error) {
      if (error) {
        return callbackError(error);
      }
      resRes = response;
      callbackSuccess(resChan, resRes);
      registerChannel(sb, CHANNEL_ID, updateMessageFunction);
    });
  });
};
export const sendMessage = (
  openChannel,
  message,
  data = CONSTANTS.RANDOM_IMAGE,
  callbackSuccess,
  callbackError,
) => {
  openChannel.sendUserMessage(message, data, (message, error) => {
    if (error) {
      return callbackError(error);
    }
    callbackSuccess(message);
  });
};
export const registerChannel = (sb, CHANNEL_ID, callback) => {
  var channelHandler = new sb.ChannelHandler();
  channelHandler.onMessageReceived = (channel, message) => {
    callback(channel, message);
  };
  sb.addChannelHandler(CHANNEL_ID, channelHandler);
};
export const registerTypingEventOnChannel = (sb, CHANNEL_ID, callback) => {
  var channelHandler = new sb.ChannelHandler();
  channelHandler.onTypingStatusUpdated = channel => {
    callback(channel);
  };
  sb.addChannelHandler(CHANNEL_ID, channelHandler);
};
export const getChannelList = (sb, callbackSuccess, callbackError) => {
  var channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.includeEmpty = true;
  channelListQuery.limit = 50; // The value of pagination limit could be set up to 100.
  if (channelListQuery.hasNext) {
    channelListQuery.next(function(channelList, error) {
      if (error) {
        return callbackError(error);
      }
      console.log(channelList);
      callbackSuccess(channelList);
    });
  }
};
export const createGroupChannel = (
  sb,
  userList = [],
  callbackSuccess,
  callbackError,
) => {
  var filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  filteredQuery.userIdsExactFilter = userList;
  filteredQuery.next(function(channels, error) {
    console.log('hi channel', channels);
    if (error) return callbackError(error);
    if (channels.length === 0) {
      //if not channels existed
      // When 'distinct' is false
      let NAME = '';
      for (let i = 0; i < userList.length; i++) NAME += '_' + userList[i];
      console.log('chat list here ', userList);
      const COVER_URL = CONSTANTS.RANDOM_IMAGE;
      const DATA = '';
      sb.GroupChannel.createChannelWithUserIds(
        userList,
        true,
        NAME,
        COVER_URL,
        DATA,
        function(groupChannel, error) {
          if (error) {
            return callbackError(error);
          }
          console.log('after create channel:' + groupChannel.url);
          return callbackSuccess(groupChannel);
        },
      );
      return;
    }
    // Only 'channelA' is returned.
    // alert("good found");
    // console.log("found channel:", channels);
    callbackSuccess(channels[0]);
  });
};
export const create1to1GroupChannel = (
  sb,
  userList = [],
  callbackSuccess,
  callbackError,
) => {
  var filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  filteredQuery.userIdsExactFilter = userList;
  filteredQuery.next(function(channels, error) {
    console.log('hi channel', channels);
    if (error) return callbackError(error);
    if (channels.length === 0) {
      //if not channels existed
      // When 'distinct' is false
      let NAME = '';
      for (let i = 0; i < userList.length; i++) NAME += '_' + userList[i];
      console.log('chat list here ', userList);
      const COVER_URL = CONSTANTS.RANDOM_IMAGE;
      const DATA = '';
      sb.GroupChannel.createChannelWithUserIds(
        userList,
        true,
        NAME,
        COVER_URL,
        DATA,
        function(groupChannel, error) {
          if (error) {
            return callbackError(error);
          }
          console.log('after create channel:' + groupChannel.url);
          return callbackSuccess(groupChannel);
        },
      );
      return;
    }
    // Only 'channelA' is returned.
    // alert("good found");
    // console.log("found channel:", channels);
    callbackSuccess(channels[0]);
  });
};
export const getChannelChatHistory = (
  channel,
  callbackSuccess,
  callbackError,
) => {
  var messageListQuery = channel.createPreviousMessageListQuery();
  messageListQuery.limit = 30;
  messageListQuery.reverse = true;
  messageListQuery.load(function(messageList, error) {
    if (error) {
      return callbackError(error);
    }
    callbackSuccess(messageList);
    // console.log(messageList);
  });
};

export const leaveChannel = (channel, callbackSuccess, callbackError) => {
  channel.leave(function(response, error) {
    if (error) {
      callbackError(error);
      return;
    }
    callbackSuccess(response);
  });
};
