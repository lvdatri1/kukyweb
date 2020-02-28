import React, {Component} from 'react';
import {
  Image,
  Share,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {Icon} from 'native-base';
import {connect} from 'react-redux';
import {voteToPost, goToProfile, reportToPost} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import CommentInputItem from './CommentInputItem';
import {Text} from './CoreUIComponents';
import ParsedText from './CoreUIComponents/ParsedText';
import GroupAvatars from './GroupAvatars';
import LikeDislikeButton from './LikeDislikeButton';
import PeertalMediaCarousel from './PeertalMediaCarousel';
import UserObject from '../models/UserObject';
import CreateTagList from './CreateTagList';

var tempCommentData = null;
var tempContentId = null;

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postDetailModal: false,
    };
    this.handleVoteButton = this.handleVoteButton.bind(this);
    this.handleDislikeButton = this.handleDislikeButton.bind(this);
    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
    this.handleTouchOnTag = this.handleTouchOnTag.bind(this);
    this.handleTouchOnContent = this.handleTouchOnContent.bind(this);
    this.handleShareButton = this.handleShareButton.bind(this);
    this.tempCommentHandler = this.tempCommentHandler.bind(this);
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };
  handleShareButton() {
    const content = {
      title: this.props.data.content,
      message:
        'https://kuky.com/' +
        this.props.data.id +
        ' ' +
        this.props.data.content,
      url: 'https://kuky.com/' + this.props.data.id,
    };
    const options = {
      subject: 'share Kuky',
      dialogTitle: 'share Kuky',
    };
    Share.share(content, options);
  }
  handleTouchOnContent() {
    // alert("cool");
    this.props.navigation.navigate('PostDetails', {
      postId: this.props.data.id,
    });
  }
  handleTouchOnTag(id) {
    // this.props.navigation.navigate("UserProfile", { userId: id });
    goToProfile(this.props.navigation, id);
  }
  _handleAction(action) {
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }

    if (action == 'report' || action == 'nsfw') {
      reportToPost(
        this.props.user.accessToken,
        {id: this.props.data.id, type: 'POST', value: action},
        res => {
          alert(
            'Thanks for helping to make this a better community. Your moderation and our algorithm will take care of this right away.',
          );
        },
      );
    }
  }
  handleVoteButton() {
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    voteToPost(
      this.props.user.accessToken,
      {id: this.props.data.id, value: 'LIKE', type: 'POST'},
      res => {
        if (this.props.callback) {
          this.props.callback();
          return;
        }
        // alert('Liked ' + res.data.data.total);
        let response = res.data;
        if (response.status === 200) {
          let newPostData = this.props.data;
          newPostData.voteData = res.data.data;
          this.props.dispatch({
            type: 'UPDATE_COMMENTS_ONE_POST',
            data: {post: newPostData},
          });
        } else {
          alert(response.message);
        }

        // alert(this.props.data.voteData.VOTE_LIKE_POST.total)
      },
    );
  }
  handleTouchOnAvatar() {
    // this.props.navigation.navigate("UserProfile", { userId: this.props.data.user.id });
    goToProfile(this.props.navigation, this.props.data.user.id);
  }
  handleDislikeButton() {
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    voteToPost(
      this.props.user.accessToken,
      {id: this.props.data.id, value: 'DISLIKE', type: 'POST'},
      res => {
        if (this.props.callback) {
          this.props.callback();
          return;
        }
        let response = res.data;
        if (response.status === 200) {
          let newPostData = this.props.data;
          newPostData.voteData = res.data.data;
          this.props.dispatch({
            type: 'UPDATE_COMMENTS_ONE_POST',
            data: {post: newPostData},
          });
        } else {
          alert(response.message);
        }
      },
    );
  }

  tempCommentHandler(data, contentId) {
    tempCommentData = data;
    tempContentId = contentId;
  }
  componentWillUnmount() {
    tempCommentData = null;
    tempContentId = null;
  }
  componentDidUpdate() {
    tempCommentData = null;
    tempContentId = null;
  }

  render() {
    const data = this.props.data;
    const votedNo = data.voteData.total;
    let tagList = '';
    tagList = CONSTANTS.renderListPeople(
      data.taggedUsers.map(item => item.fullName),
    );
    let votedList = '';
    if (data.voteData != null) {
      votedList =
        'Voted by ' +
        CONSTANTS.renderListPeople(
          data.voteData.votedUsers.map(item => item.fullName),
        );
    }
    const commentNo = data.totalComments;
    const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);

    let fullName, avatarUrl;
    const user = data.user || new UserObject();
    fullName = user.fullName;
    avatarUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const locationAddress = data.locationAddress || '';
    const exRate = this.props.user.settings.exchangeRate;
    const exCurrency = this.props.user.settings.preferredCurrency || 'USD';
    let postMoney = '';
    if (data.money.totalCoin > 0) {
      postMoney =
        '$ ' + (data.money.totalCoin * exRate).toFixed(2) + ' ' + exCurrency;
    }
    let groupAvatar = null;
    if (data.voteData.votedUsers.length != null) {
      groupAvatar = data.voteData.votedUsers.map(item => item.avatarUrl);
    }
    //calculate status of like/dislike...
    const likeButtonEnabled = data.voteData.upData.active === true;
    const dislikeButtonEnabled = data.voteData.downData.active === true;
    const callback = this.props.callback;
    const shareNo = 0; //not yet have in our system
    /* Hide wallet and money transfer feature for ios */
    /* let options = ['Report', 'Reward', 'Cancel']; */
    let options =
      Platform.OS === 'ios'
        ? ['Report', 'Cancel']
        : ['Report', 'Reward', 'Cancel'];
    if (data.isOwner) {
      /* Hide wallet and money transfer feature for ios */
      options =
        Platform.OS === 'ios'
          ? ['Report', 'Edit', 'Cancel']
          : ['Report', 'Reward', 'Edit', 'Cancel'];
    }

    return (
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: 'white',
          paddingBottom: 10,
          borderBottomColor: '#F3F4F4',
          borderBottomWidth: 10,
          shadowColor: 'blue',
        }}>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <TouchableOpacity onPress={this.handleTouchOnAvatar}>
            <Image
              source={{uri: avatarUrl}}
              style={{
                width: 48,
                height: 48,
                borderRadius: 48 / 2,
                backgroundColor: 'gray',
                marginLeft: 12,
                alignSelf: 'flex-start',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: CONSTANTS.WIDTH - 86,
              paddingLeft: 12,
              backgroundColor: 'white',
              paddingTop: 6,
              flexDirection: 'column',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>{fullName}</Text>
            <Text
              style={{
                fontWeight: '200',
                fontSize: 12,
                color: CONSTANTS.MY_GREY,
              }}>
              {timeAgo}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={this.showActionSheet}>
              <Icon
                name="dots-three-vertical"
                type="Entypo"
                style={{fontSize: 16, fontWeight: '200'}}
              />
            </TouchableOpacity>
          </View>
        </View>

        {data.taggedUsers.length == 0 &&
        locationAddress == '' &&
        postMoney == '' ? null : (
          <View
            style={{
              flexDirection: 'column',
              marginTop: 5,
              // borderLeftWidth: 1,
              marginLeft: 36,
              borderStyle: 'dashed',
              borderColor: 'gray',
              borderWidth: 1,
              // borderLeftColor: 'gray', //react native does not support
              // style border on just a line
              minHeight: 40,
            }}>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: 'white',
                minHeight: 40,
                marginRight: -1,
                marginBottom: -1,
                marginTop: -1,
              }}>
              {data.taggedUsers.length == 0 ? null : (
                <View
                  style={{flexDirection: 'row', marginLeft: 12, marginTop: 5}}>
                  <Image
                    source={require('../assets/xd/Icons/users.png')}
                    style={{width: 14, height: 14}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      textAlignVertical: 'center',
                      marginLeft: 10,
                    }}>
                    <CreateTagList
                      data={data.taggedUsers}
                      callback={this.handleTouchOnTag}
                    />
                  </Text>
                </View>
              )}
              {locationAddress != '' ? (
                <View
                  style={{flexDirection: 'row', marginLeft: 12, marginTop: 5}}>
                  <Image
                    source={require('../assets/xd/Icons/post_location.png')}
                    style={{width: 14, height: 14}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      textAlignVertical: 'center',
                      marginLeft: 10,
                      maxWidth: CONSTANTS.WIDTH - 80,
                    }}>
                    {locationAddress}
                  </Text>
                </View>
              ) : null}
              {/* Hide wallet and money transfer feature for ios */}
              {Platform.OS === 'ios' ? null : postMoney !== '' ? (
                <View
                  style={{flexDirection: 'row', marginLeft: 12, marginTop: 5}}>
                  <Image
                    source={require('../assets/xd/Icons/post_money.png')}
                    style={{width: 14, height: 14}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      textAlignVertical: 'center',
                      marginLeft: 10,
                    }}>
                    {postMoney}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
        )}

        <View style={{marginHorizontal: 12, marginVertical: 12}}>
          <TouchableOpacity activeOpacity={0.6} onPress={this.handleTouchOnContent}>
            <ParsedText>{data.content}</ParsedText>
          </TouchableOpacity>
        </View>
        <View>
          <PeertalMediaCarousel data={data.media} />
        </View>
        <View style={{flexDirection: 'row', marginLeft: 12, height: 30}}>
          <LikeDislikeButton
            onPress={this.handleVoteButton}
            type="like"
            active={likeButtonEnabled}
            callback={callback}
          />
          <Text style={{marginHorizontal: 8, fontSize: 14}}>{votedNo}</Text>
          <LikeDislikeButton
            onPress={this.handleDislikeButton}
            type="dislike"
            active={dislikeButtonEnabled}
            callback={callback}
          />
          <LikeDislikeButton
            type="comment"
            onPress={this.handleTouchOnContent}
            active={true}
            style={{marginLeft: 8}}
          />
          <Text style={{marginHorizontal: 8, fontSize: 14}}>{commentNo}</Text>
          <LikeDislikeButton
            type="share"
            onPress={this.handleShareButton}
            active={true}
            style={{marginLeft: 8}}
          />
          <Text style={{marginHorizontal: 8, fontSize: 14}}>{shareNo}</Text>
          <View style={{position: 'absolute', right: 16, bottom: 10}}>
            <GroupAvatars data={groupAvatar} />
          </View>
        </View>

        <View style={{}}>
          {tempCommentData == null ? null : this.props.data.id !=
            tempContentId ? null : (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 10,
                marginHorizontal: 15,
              }}>
              <Image
                source={{uri: tempCommentData.user.avatarUrl}}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 48 / 2,
                  alignSelf: 'flex-start',
                }}
              />
              <View>
                <View>
                  <View
                    style={{
                      width: CONSTANTS.WIDTH - 30 - 48 - 10,
                      minHeight: 48,
                      borderRadius: 6,
                      backgroundColor: '#F3F4F4',
                      marginHorizontal: 10,
                      flexDirection: 'column',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 10,
                        marginTop: 10,
                        flexDirection: 'row',
                      }}>
                      <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                        {tempCommentData.user.fullName}
                      </Text>
                    </View>
                    <ParsedText
                      style={{
                        marginHorizontal: 10,
                        fontSize: 14,
                        marginVertical: 8,
                      }}>
                      {tempCommentData.content}
                    </ParsedText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: 15,
                      marginTop: 5,
                      alignItems: 'center',
                    }}></View>
                </View>
              </View>
            </View>
          )}

          <CommentInputItem
            onFocus={() => {
              if (this.props.user.loggedStatus === 'guest') {
                this.props.navigation.navigate('Welcome');
                return;
              }
            }}
            data={data}
            callback={callback}
            user={this.props.user}
            navigation={this.props.navigation}
            showCommentOnce={this.tempCommentHandler}
          />
        </View>

        {/* Hide wallet and money transfer feature for ios */}
        {Platform.OS === 'ios' ? (
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Which action do you like to do?'}
            options={options}
            cancelButtonIndex={options.length - 1}
            destructiveButtonIndex={1}
            onPress={index => {
              /* do something */
              switch (index) {
                case 0:
                  Alert.alert(
                    'Report',
                    'How would you like this content to be reported?',
                    [
                      {
                        text: '+18 content',
                        onPress: () => {
                          this._handleAction('nsfw');
                        },
                      },
                      {
                        text: 'Delete this',
                        onPress: () => {
                          this._handleAction('report');
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                          // this._handleAction("report");
                        },
                      },
                    ],
                  );
                  break;
                case 1:
                  if (options[1] == 'Edit') {
                    this.props.navigation.navigate('UpdatePost', {
                      postData: data,
                    });
                  }
                  break;
                default:
              }
            }}
          />
        ) : (
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Which action do you like to do?'}
            options={options}
            cancelButtonIndex={options.length - 1}
            destructiveButtonIndex={1}
            onPress={index => {
              /* do something */
              switch (index) {
                case 0:
                  Alert.alert(
                    'Report',
                    'How would you like this content to be reported?',
                    [
                      {
                        text: '+18 content',
                        onPress: () => {
                          this._handleAction('nsfw');
                        },
                      },
                      {
                        text: 'Delete this',
                        onPress: () => {
                          this._handleAction('report');
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                          // this._handleAction("report");
                        },
                      },
                    ],
                  );
                  break;
                case 1:
                  this.props.navigation.navigate('SendMoney', {
                    tagList: [user],
                  });
                  break;
                case 2:
                  if (options[1] == 'Edit') {
                    this.props.navigation.navigate('UpdatePost', {
                      postData: data,
                    });
                  }
                  break;
                default:
              }
            }}
          />
        )}
      </View>
    );
  }
}

const MapStateToProps = store => ({user: store.user});
const PostItemContainer = connect(MapStateToProps)(PostItem);
export default PostItemContainer;