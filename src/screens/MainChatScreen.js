import {Icon} from 'native-base';
import React from 'react';
import {Image, Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {GiftedChat, Send, MessageText} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {
  getChannelChatHistory,
  registerChannel,
  registerTypingEventOnChannel,
  sendMessage,
  leaveChannel,
} from '../actions/chatActions';
import {uploadMediaToPeertal} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {Text} from '../components/CoreUIComponents';
import UserObject from '../models/UserObject';
import * as CommonMessageHandler from '../common/CommonMessageHandler';
import RNFS from 'react-native-fs';
import ReactNativeImagePicker from 'react-native-image-picker';
import {PhotoEditorWithImage} from '../common/PhotoEditorHandler';

class MainChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      media: null,
      messages: [],
      isLoading: false,
      channel: null,
      user: {_id: 1, name: 'Kuky default'},
      sb: null,
      userHeader: new UserObject(),
      channelUrl: '',
      isTyping: false,
      typingMembers: [],
      minInputToolbarHeight: 45,
      isKeyboardUp: false,
    };

    this._connectSB = this._connectSB.bind(this);
    this._enterChannel = this._enterChannel.bind(this);
    this._sendMessageToChannel = this._sendMessageToChannel.bind(this);
    this._getChatHistory = this._getChatHistory.bind(this);
    this._loadData = this._loadData.bind(this);
    this._resetData = this._resetData.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleUploadPhoto = this._handleUploadPhoto.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this.onSend = this.onSend.bind(this);
    this._leaveGroupAction = this._leaveGroupAction.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  _leaveGroupAction() {
    leaveChannel(
      this.state.channel,
      res => {
        this.props.navigation.goBack();
      },
      err => alert('Error! when leaving this channel'),
    );
  }
  onSend(messages = []) {
    console.log('message chat', messages[0].text);
    // this.setState(previousState => ({
    //   media: null,
    //   messages: GiftedChat.append(previousState.messages, messages)
    // }));
    this._sendMessageToChannel(messages[0].text);
  }

  _handleUploadPhoto(mediaType = 'photo') {
    const options = {
      noData: true,
      mediaType: mediaType,
    };
    ReactNativeImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        PhotoEditorWithImage(response.uri, result => {
          RNFS.readFile(result.image, 'base64').then(base64data => {
            uploadMediaToPeertal(
              this.props.user.accessToken,
              `data:${'image/jpeg'};base64,` + base64data,
              'post',
              res => {
                this.setState({media: res.data.data});
              },
              err => {
                console.log('error upload', err);
                alert('error some where');
              },
              event => {},
            );
          }),
            error => {
              const errorMessage = CommonMessageHandler.errorOutputByKey(error.code);
              if(errorMessage !== "no alert"){
                errorMessage == false ? CommonMessageHandler.alert("cannot open camera") : CommonMessageHandler.alert(errorMessage)
              }
            };
        });
      }
    });
  }
  _resetData() {
    this.state.sb.removeChannelHandler('chatView');
    this.state.sb.removeChannelHandler('chatTyping');
  }
  _loadData() {
    this.setState(
      {
        sb: this.props.navigation.getParam('sb'),
        channel: this.props.navigation.getParam('channel'),
        user: this.props.navigation.getParam('user'),
        userHeader: this.props.navigation.getParam('header'),
        channelUrl: this.props.navigation.getParam('channelUrl'),
        messages: [],
        userToken: this.props.navigation.getParam('userToken'),
      },
      () => {
        this._enterChannel();
        this._getChatHistory();
      },
    );
  }
  _convertMessage(item) {
    return {
      _id: item.messageId,
      text: item.message,
      image: item.data,
      user: {
        _id: item._sender.userId,
        name: item._sender.nickname,
        avatar: item._sender.profileUrl,
      },
      createdAt: item.createdAt,
    };
  }
  _getChatHistory() {
    getChannelChatHistory(
      this.state.channel,
      messages => {
        this.setState(
          {
            messages: messages.map(item => this._convertMessage(item)),
          },
          () => {
            console.log('message is here', this.state.messages);
            console.log('message is here, user', this.state.user);
          },
        );
      },
      error => alert('error at get history'),
    );
  }
  _connectSB(callback) {
    this.setState({isLoading: true});
    var _self = this;
    this.state.sb.connect(USER_ID, (user, error) => {
      if (error) {
        alert('error at connect');
        console.log('chat error');
        console.log(error);
        return;
      }
      console.log('new user is', user);
      _self.setState({
        isLoading: false,
        user: {_id: user.userId, avatar: user.profileUrl, name: user.nickname},
      });
    });
  }
  _enterChannel() {
    let _self = this;
    let channelId = 'chatView';
    let onReceiveMessage = (channel, message) => {
      if (channel.url == _self.state.channel.url)
        this.setState({
          messages: [this._convertMessage(message), ...this.state.messages],
        });
    };
    registerChannel(this.state.sb, channelId, onReceiveMessage);
    //register event handler
    let channelTypingId = 'chatTyping';
    let onMembersTyping = channel => {
      if (channel.url == _self.state.channel.url) {
        let mems = channel.getTypingMembers();
        _self.setState({isTyping: mems.length > 0, typingMembers: mems});
      }
    };
    registerTypingEventOnChannel(
      this.state.sb,
      channelTypingId,
      onMembersTyping,
    );
  }
  _handleTextChange(text) {
    this.setState({text: text});
    this.state.channel.startTyping();
  }
  _sendMessageToChannel(message) {
    this.state.channel.endTyping();
    const data = this.state.media ? this.state.media.url : '';
    // this.setState({ isLoading: true });
    sendMessage(
      this.state.channel,
      message,
      data,
      message => {
        // this.setState({ isLoading: false, media: null });
        this.setState(previousState => ({
          media: null,
          text: '',
          messages: GiftedChat.append(previousState.messages, [
            this._convertMessage(message),
          ]),
        }));
      },
      error => {
        alert(error);
      },
    );
  }
  renderSend(props) {
    var _self = this;
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: 10,
            marginBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {_self.state.media ? (
            <View>
              <Image
                source={{uri: _self.state.media.url}}
                style={{height: 40, width: 40, marginRight: 15}}
              />
              <TouchableOpacity
                style={{marginTop: -40, marginLeft: 25}}
                onPress={() => _self.setState({media: null})}>
                <Icon
                  name="ios-close-circle"
                  style={{color: 'red', fontSize: 16}}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => _self._handleUploadPhoto()}
            style={{marginRight: 15}}>
            <Icon name="ios-camera" />
          </TouchableOpacity>
          <Icon name="send" />
        </View>
      </Send>
    );
  }
  renderMessageText(props) {
    const textStyle = {
      fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    };
    return (
      <MessageText textStyle={{left: textStyle, right: textStyle}} {...props} />
    );
  }
  _renderFooter() {
    let typingText = '';
    if (this.state.typingMembers.length > 0) {
      typingText = this.state.typingMembers[0].nickname + ' is typing';
    }
    return <Text>{typingText}</Text>;
    s;
  }
  render() {
    let chatTitle = 'Chat with ';
    if (this.state.channel) {
      const members = this.state.channel.members.filter(
        item => item.userId != this.state.user._id,
      );
      if (members.length > 0) {
        let i = 0;
        for (i = 0; i < members.length; i++)
          chatTitle +=
            members[i].nickname + (i < members.length - 1 ? ', ' : '');
      }
    }
    const avatarUrl = this.state.userHeader.avatarUrl || CONSTANTS.RANDOM_IMAGE;
    if (this.state.channel) this.state.channel.markAsRead();
    //options for action sheet
    const options = ['Cancel', 'Leave'];
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          marginTop: CONSTANTS.SPARE_HEADER,
        }}>
        <NavigationEvents
          onWillFocus={this._loadData}
          onWillBlur={this._resetData}
        />
        <View
          style={{
            height: 46,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 0.1,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                // alignSelf: "flex-start",
                marginLeft: 10,
              }}>
              <Icon name="arrowleft" type="AntDesign" />
            </TouchableOpacity>
            <Image
              source={{uri: avatarUrl}}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginHorizontal: 10,
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                maxWidth: 200 * CONSTANTS.WIDTH_RATIO,
              }}>
              {chatTitle}
            </Text>
          </View>
          <TouchableOpacity onPress={this.showActionSheet}>
            <Icon
              name="dots-three-vertical"
              type="Entypo"
              style={{
                fontSize: 16,
                fontWeight: '200',
                marginRight: 10,
                marginTop: 10,
              }}
            />
          </TouchableOpacity>
        </View>
        <View>{this.state.isLoading ? <Text>Loading</Text> : null}</View>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          onInputTextChanged={this._handleTextChange}
          style={{marginBottom: 100, flex: 0.9}}
          text={this.state.text}
          user={this.state.user}
          showAvatarForEveryMessage={true}
          alwaysShowSend={true}
          isAnimated={true}
          showUserAvatar={true}
          placeholder="Type a message"
          renderFooter={this._renderFooter}
          renderSend={this.renderSend}
          renderMessageText={this.renderMessageText}
          textInputProps={{
            returnKeyType: 'send',
            onSubmitEditing: () => {
              this._sendMessageToChannel(this.state.text);
            },
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'Which action do you like to do?'}
          options={options}
          cancelButtonIndex={options.length - 1}
          destructiveButtonIndex={1}
          onPress={index => {
            /* do something */
            switch (index) {
              case 1:
                this._leaveGroupAction();
                break;
              default:
            }
          }}
        />
        <View style={{height: CONSTANTS.SPARE_FOOTER + 25}} />
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user,
});
const MainChatContainer = connect(mapStateToProps)(MainChatScreen);
export default MainChatContainer;
