import {Icon} from 'native-base';
import {NavigationEvents} from 'react-navigation';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import {
  Keyboard,
  Platform,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import {getPostDetails} from '../actions/postActions';
import {voteToPost, goToProfile, reportToPost} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import PostObject from '../models/PostObject';
import UserObject from '../models/UserObject';
import CommentInputItem from '../components/CommentInputItem';
import CommentItem from '../components/CommentItem';
import {Text, ParsedText} from '../components/CoreUIComponents';
import GroupAvatars from '../components/GroupAvatars';
import LikeDislikeButton from '../components/LikeDislikeButton';
import PeertalMediaCarousel from '../components/PeertalMediaCarousel';
class PostDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.myScroll = React.createRef();
    this._onShow = this._onShow.bind(this);
    this.handleVoteButton = this.handleVoteButton.bind(this);
    this.handleDislikeButton = this.handleDislikeButton.bind(this);
    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
    this._renderCommentItem = this._renderCommentItem.bind(this);
    this._loadData = this._loadData.bind(this);
    this.handleShareButton = this.handleShareButton.bind(this);
    this._renderKeyboardBump = this._renderKeyboardBump.bind(this);
    this._renderReplyBump = this._renderReplyBump.bind(this);
    this._handleAction = this._handleAction.bind(this);
    this.state = {
      isLoading: false,
      postData: new PostObject(),
      minInputToolbarHeight: 0,
      focus: '',
    };
  }

  _handleAction(action) {
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }

    if (action == 'report' || action == 'nsfw') {
      reportToPost(
        this.props.user.accessToken,
        {id: this.state.postData.id, type: 'POST', value: action},
        res => {
          alert(
            'Thanks for helping to make this a better community. Your moderation and our algorithm will take care of this right away.',
          );
        },
      );
    }
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  handleShareButton() {
    const content = {
      title: this.state.postData.content,
      message:
        'https://kuky.com/' +
        this.state.postData.id +
        ' ' +
        this.state.postData.content,
      url: 'https://kuky.com/' + this.state.postData.id,
    };
    const options = {
      subject: 'share Kuky',
      dialogTitle: 'share Kuky',
    };
    Share.share(content, options);
  }
  _renderReplyBump() {
    if (Platform.OS === 'ios' && this.state.focus != 'comment')
      return <View style={{width: '100%', height: 300}} />;
  }
  _renderKeyboardBump() {
    if (Platform.OS === 'ios' && this.state.focus === 'comment')
      return (
        <View
          style={{width: '100%', height: this.state.minInputToolbarHeight}}
        />
      );
  }
  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    }
  }
  _keyboardDidShow = e => {
    let keyboardHeight = e.endCoordinates.height;
    this.setState({
      minInputToolbarHeight: keyboardHeight + 45 - CONSTANTS.SPARE_FOOTER,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      minInputToolbarHeight: 45,
    });
  };

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }
  _renderCommentItem() {
    if (this.state.postData.length == 0) return <View />;
    else {
      return this.state.postData.comments.map(item => (
        <View key={item.id}>
          <CommentItem
            data={item}
            user={this.props.user}
            callback={this._loadData}
            postId={this.state.postData.id}
          />
        </View>
      ));
    }
  }

  _loadData() {
    const postId = this.props.navigation.getParam('postId') || 100;
    this.setState({isLoading: true});
    getPostDetails(this.props.user.accessToken, postId, res => {
      this.setState(preState => {
        return {
          ...preState,
          postData: res.data.data.post_data,
          isLoading: false,
        };
      });
    });
  }
  handleVoteButton() {
    if (this.state.isLoading) return;
    this.setState({isLoading: true});
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    voteToPost(
      this.props.user.accessToken,
      {id: this.state.postData.id, value: 'LIKE', type: 'POST'},
      res => {
        // alert('Liked ' + res.data.data.total);
        // alert(this.state.postData.voteData.VOTE_LIKE_POST.total)
        this.setState({isLoading: false});
        this._loadData();
      },
    );
  }
  handleTouchOnAvatar() {
    this.props.navigation.navigate('UserProfile', {
      userId: this.state.postData.user.id,
    });
  }
  handleDislikeButton() {
    if (this.state.isLoading) return;
    this.setState({isLoading: true});
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    voteToPost(
      this.props.user.accessToken,
      {id: this.state.postData.id, value: 'DISLIKE', type: 'POST'},
      res => {
        this._loadData();
        this.setState({isLoading: false});
      },
    );
  }
  _onShow() {
    this.myScroll.current.scrollToEnd({animated: true});
    this._loadData();
  }
  render() {
    const data = this.state.postData;
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
    const shareNo = 0;
    const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);
    let fullName, avatarUrl;
    const user = data.user || new UserObject();
    fullName = user.fullName;
    avatarUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const locationAddress = data.locationAddress || 'somewhere in the world';
    const postMoney = '$ ' + data.money.totalCoin;
    let groupAvatar = null;
    if (data.voteData.votedUsers.length != null) {
      groupAvatar = data.voteData.votedUsers.map(item => item.avatarUrl);
    }
    //calculate status of like/dislike...
    const likeButtonEnabled = data.voteData.upData.active === true;
    const dislikeButtonEnabled = data.voteData.downData.active === true;
    const postTitle = user.fullName + " 's post";
    /* Hide wallet and money transfer feature for ios */
    let options =
      Platform.OS === 'ios'
        ? ['Report', 'Cancel']
        : (options = ['Report', 'Reward', 'Cancel']);
    if (this.props.user.userId == this.state.postData.user.id) {
      /* Hide wallet and money transfer feature for ios */
      options =
        Platform.OS === 'ios'
          ? ['Report', 'Edit', 'Cancel']
          : (options = ['Report', 'Reward', 'Edit', 'Cancel']);
    }
    return (
      <View
        style={{
          marginTop: CONSTANTS.SPARE_HEADER,
          flexDirection: 'column',
          marginBottom: CONSTANTS.SPARE_FOOTER,
          flex: 1,
        }}>
        <NavigationEvents
          onWillFocus={() => {
            this._loadData();
          }}
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
            <Text
              style={{
                marginLeft: 10,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              {postTitle}
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
        {/* change to flex 0.5 on Android */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._loadData}
            />
          }
          style={{flex: 0.8}}
          ref={this.myScroll}>
          <View style={{marginHorizontal: 12, marginVertical: 12}}>
            <ParsedText>{data.content}</ParsedText>
          </View>
          <PeertalMediaCarousel data={data.media} />
          <View style={{flexDirection: 'row', marginLeft: 12, height: 30}}>
            <LikeDislikeButton
              onPress={this.handleVoteButton}
              type="like"
              active={likeButtonEnabled}
            />
            <Text style={{marginHorizontal: 8, fontSize: 14}}>{votedNo}</Text>
            <LikeDislikeButton
              onPress={this.handleDislikeButton}
              type="dislike"
              active={dislikeButtonEnabled}
            />
            <LikeDislikeButton
              type="comment"
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
            <View style={{position: 'absolute', right: 16}}>
              <GroupAvatars data={groupAvatar} />
            </View>
          </View>
          <View>{this._renderCommentItem()}</View>
          {this.state.focus == 'comment' ? this._renderReplyBump() : null}

          <View style={{minHeight: 80, backgroundColor: 'white'}} />
        </ScrollView>
        <View style={{flex: 0.1}}>
          <CommentInputItem
            postID={this.state.postData.id}
            data={this.state.postData}
            callback={this._loadData}
            onFocus={() => {
              if (this.props.user.loggedStatus === 'guest') {
                this.props.navigation.navigate('Welcome');
                return;
              }
              this.setState({focus: 'comment'});
            }}
            onBlur={() => this.setState({focus: ''})}
            navigation={this.props.navigation}
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

        {this.state.focus === 'comment' ? this._renderKeyboardBump() : null}
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user,
});
const PostDetailsContainer = connect(mapStateToProps)(PostDetailsScreen);
export default PostDetailsContainer;
