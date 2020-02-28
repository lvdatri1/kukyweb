import {Icon} from 'native-base';
import React, {Component} from 'react';
import {Image, TouchableOpacity, View, ScrollView} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import SendBird from 'sendbird';
import CONSTANTS from '../common/PeertalConstants';
import Footer from '../components/Footer';
import PersonChatItem from '../components/PersonChatItem';
import {Text, Avatar} from '../components/CoreUIComponents';
import TagPeopleModal from '../components/TagPeopleModal';
import SearchBar from '../components/SearchBar';
import {
  enterChannel,
  registerChannel,
  sendMessage,
  getChannelList,
  create1to1GroupChannel,
  createGroupChannel,
} from '../actions/chatActions';
import UserObject from '../models/UserObject';

class ChatControlScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      currentTab: 'messages', //or groups
      tagPeopleModal: false,
      tagList: [],
      isLoading: false,
      user: new UserObject(),
      sb: new SendBird({appId: CONSTANTS.SEND_BIRD.APP_ID}),
      channelList: null,
    };
    this.handleSearchTouch = this.handleSearchTouch.bind(this);
    this._renderItems = this._renderItems.bind(this);
    this.updateTagList = this.updateTagList.bind(this);
    this._loadChat = this._loadChat.bind(this);
    this._create1To1Chat = this._create1To1Chat.bind(this);
    this._handleSelectPersonCallback = this._handleSelectPersonCallback.bind(
      this,
    );
    this._createGroupChat = this._createGroupChat.bind(this);
  }
  _resetChat() {}
  _loadChat() {
    this.setState({
      isLoading: true,
      user: {
        _id: this.props.user.userId + '',
        fullName: this.props.user.fullName,
      },
    });
    var _self = this;
    this.state.sb.connect(this.props.user.userId.toString(), (user, error) => {
      if (error) {
        alert('error at connect');
        return;
      }
      console.log('new user is', user);
      // alert("login" + user.userId);
      _self.state.sb.updateCurrentUserInfo(
        _self.props.user.fullName,
        _self.props.user.avatarUrl,
        (res, error) => {
          if (error) {
            alert('error at updating user avatar');
          }
        },
      );
      _self.setState({
        isLoading: false,
        user: {
          _id: user.userId + '',
          avatar: user.profileUrl,
          name: user.nickname,
        },
      });
      getChannelList(this.state.sb, channelList => {
        _self.setState({channelList: channelList});
        console.log('here is channel list', channelList);
      });
    });
  }
  updateTagList(list) {
    console.log('list updated here', list);
    this.setState({
      tagList: list,
    });
  }
  _handleSelectPersonCallback(list) {
    let _self = this;
    if (_self.state.currentTab === 'messages') _self._create1To1Chat(list);
    else {
      _self.updateTagList(list);
    }
  }
  _create1To1Chat(list) {
    let _self = this;
    this.setState({
      // tagList: list,
      tagPeopleModal: false,
    });
    if (list.length < 1) return;
    let friend = list[0];
    let userList = [this.props.user.userId.toString(), friend.id.toString()];
    create1to1GroupChannel(
      this.state.sb,
      userList,
      channel => {
        console.log('here is channel', channel.url);
        this.props.navigation.navigate('MainChat', {
          sb: this.state.sb,
          channel: channel,
          user: this.state.user,
          header: friend,
          channelUrl: channel.url,
        });
      },
      error => alert('error at creating channel'),
    );
  }
  _createGroupChat() {
    let _self = this;
    this.setState({
      // tagList: list,
      tagPeopleModal: false,
    });
    if (this.state.tagList.length < 1) return;
    // let friend = list[0];
    // let userList = [this.props.user.userId, friend.id];
    let userList = this.state.tagList.map(item => item.id);
    userList.push(this.props.user.userId);
    createGroupChannel(
      this.state.sb,
      userList,
      channel => {
        console.log('here is channel', channel.url);
        this.props.navigation.navigate('MainChat', {
          sb: this.state.sb,
          channel: channel,
          user: this.state.user,
          header: this.state.tagList[0],
          channelUrl: channel.url,
        });
      },
      error => alert('error at creating channel'),
    );
  }

  _renderItems() {
    const _self = this;
    var expectedMembers = this.state.currentTab == 'messages' ? 2 : 3;
    if (this.state.channelList == null) return null;
    return this.state.channelList.map((item, index) => {
      if (
        (item.members.length >= 3 && expectedMembers === 3) ||
        (item.members.length === 2 && expectedMembers === 2)
      ) {
        return (
          <PersonChatItem
            user={this.props.user}
            data={item}
            key={index}
            callback={() => {
              this.props.navigation.navigate('MainChat', {
                sb: this.state.sb,
                channel: item,
                user: this.state.user,
                header: new UserObject(),
                channelUrl: item.url,
              });
            }}
          />
        );
      }
    });
  }

  handleSearchTouch() {
    this.setState({...this.state, isSearch: !this.state.isSearch});
  }

  render() {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        <NavigationEvents onWillFocus={this._loadChat} />
        <View
          style={{
            flex: 100 + CONSTANTS.SPARE_HEADER,
            flexDirection: 'column',
            height: 120,
            backgroundColor: 'white',
          }}>
          {/* <StatusBar /> */}
          <View
            style={{flexDirection: 'row', marginTop: CONSTANTS.SPARE_HEADER}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.toggleDrawer()}>
              <Image
                source={{uri: this.props.user.avatarUrl}}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
            <SearchBar navigation={this.props.navigation} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginVertical: 15,
              // backgroundColor: "red"
            }}>
            <TouchableOpacity
              onPress={() => this.setState({currentTab: 'messages'})}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: CONSTANTS.MY_FONT_HEADER_2_SIZE,
                  color:
                    this.state.currentTab == 'messages'
                      ? 'black'
                      : CONSTANTS.MY_GREY,
                }}>
                Messages
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({currentTab: 'groups'})}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: CONSTANTS.MY_FONT_HEADER_2_SIZE,
                  color:
                    this.state.currentTab == 'groups'
                      ? 'black'
                      : CONSTANTS.MY_GREY,
                }}>
                Groups
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            // backgroundColor: "gray",
            flex:
              CONSTANTS.HEIGHT -
              55 -
              100 -
              CONSTANTS.SPARE_FOOTER -
              CONSTANTS.SPARE_HEADER,
          }}>
          <ScrollView>
            <Text
              style={{
                marginTop: 10,
                marginHorizontal: 15,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              Start a new chat
            </Text>
            <ScrollView
              horizontal
              style={{flexDirection: 'row', alignContent: 'center'}}>
              <TouchableOpacity
                onPress={() => this.setState({tagPeopleModal: true})}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 10,
                  borderColor: CONSTANTS.MY_BLUE,
                  borderWidth: 1,
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}>
                <Icon
                  name="plus"
                  type="AntDesign"
                  style={{fontSize: 15, color: CONSTANTS.MY_BLUE}}
                />
              </TouchableOpacity>
              {this.state.tagList.map((item, index) => (
                <Avatar
                  source={{uri: item.avatarUrl}}
                  text={item.fullName}
                  key={index}
                />
              ))}
            </ScrollView>
            <Text style={{marginTop: 10, marginHorizontal: 15}}>
              {this.state.isLoading ? 'loading' : 'current chat'}
            </Text>

            {this._renderItems()}
          </ScrollView>
        </View>

        <View style={{flex: 55 + CONSTANTS.SPARE_FOOTER}}>
          <Footer {...this.props} active="people" />
        </View>
        <TagPeopleModal
          title={
            this.state.currentTab === 'messages'
              ? 'Create chat'
              : 'Create group chat'
          }
          enabled={this.state.tagPeopleModal}
          onClose={() => this.setState({tagPeopleModal: false})}
          callback={this._handleSelectPersonCallback}
          rightButton={this.state.currentTab === 'groups'}
          rightCallback={this._createGroupChat}
        />
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user,
});
const ChatControlContainer = connect(mapStateToProps)(ChatControlScreen);
export default ChatControlContainer;
