import { Icon } from "native-base";
import React, { Component } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
  Keyboard,
  Platform
} from "react-native";
import { getPostDetails } from "../actions/postActions";
import { voteToPost } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import PostObject from "../models/PostObject";
import CommentInputItem from "./CommentInputItem";
import CommentItem from "./CommentItem";
import { Text } from "./CoreUIComponents";
import GroupAvatars from "./GroupAvatars";
import LikeDislikeButton from "./LikeDislikeButton";
import PeertalMediaCarousel from "./PeertalMediaCarousel";
import UserObject from "../models/UserObject";
export default class PostDetailModal extends Component {
  constructor(props) {
    super(props);
    this.myScroll = React.createRef();
    this._onShow = this._onShow.bind(this);
    this.handleVoteButton = this.handleVoteButton.bind(this);
    this.handleDislikeButton = this.handleDislikeButton.bind(this);
    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
    this._renderCommentItem = this._renderCommentItem.bind(this);
    this._loadData = this._loadData.bind(this);
    this._initData = this._initData.bind(this);
    this._renderKeyboardBump = this._renderKeyboardBump.bind(this);
    this._renderReplyBump = this._renderReplyBump.bind(this);
    this.state = {
      isLoading: false,
      postData: new PostObject(),
      minInputToolbarHeight: 0,
      focus: ""
    };
  }
  _renderReplyBump() {
    if (Platform.OS === "ios" && this.state.focus != "comment") return <View style={{ width: "100%", height: 300 }} />;
  }
  _renderKeyboardBump() {
    if (Platform.OS === "ios" && this.state.focus === "comment")
      return <View style={{ width: "100%", height: this.state.minInputToolbarHeight }} />;
  }
  componentWillMount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }
  }
  _keyboardDidShow = e => {
    let keyboardHeight = e.endCoordinates.height;
    this.setState({
      minInputToolbarHeight: keyboardHeight + 45 - CONSTANTS.SPARE_FOOTER
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      minInputToolbarHeight: 45
    });
  };

  componentWillUnmount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }
  _renderCommentItem() {
    if (this.state.postData.length == 0) return <View />;
    else {
      return this.state.postData.comments.map(item => (
        <View key={item.id}>
          <CommentItem data={item} user={this.props.user} callback={this._loadData} postId={this.state.postData.id} />
        </View>
      ));
    }
  }
  _initData() {
    this.setState({ isLoading: false, postData: { ...this.props.data } });
  }
  _loadData() {
    this.setState({ isLoading: true });
    getPostDetails(this.props.user.accessToken, this.props.data.id, res => {
      this.setState(preState => {
        return {
          ...preState,
          postData: res.data.data.post_data,
          isLoading: false
        };
      });
    });
  }
  componentDidMount() {
    // this._loadData();
  }
  handleVoteButton() {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true });
    voteToPost(this.props.user.accessToken, { id: this.props.data.id, value: "LIKE", type: "POST" }, res => {
      // alert('Liked ' + res.data.data.total);
      // alert(this.props.data.voteData.VOTE_LIKE_POST.total)
      this.setState({ isLoading: false });
      this._loadData();
    });
  }
  handleTouchOnAvatar() {
    this.props.navigation.navigate("UserProfile", { userId: this.props.data.user.id });
  }
  handleDislikeButton() {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true });
    voteToPost(this.props.user.accessToken, { id: this.props.data.id, value: "DISLIKE", type: "POST" }, res => {
      this._loadData();
      this.setState({ isLoading: false });
    });
  }
  _onShow() {
    this.myScroll.current.scrollToEnd({ animated: true });
    this._loadData();
  }
  render() {
    const data = this.state.postData;
    const votedNo = data.voteData.total;
    let tagList = "";
    tagList = CONSTANTS.renderListPeople(data.taggedUsers.map(item => item.fullName));
    let votedList = "";
    if (data.voteData != null) {
      votedList = "Voted by " + CONSTANTS.renderListPeople(data.voteData.votedUsers.map(item => item.fullName));
    }
    const commentNo = data.comments.length;
    const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);

    let fullName, avatarUrl;
    const user = data.user || new UserObject();
    fullName = user.fullName;
    avatarUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const locationAddress = data.locationAddress || "somewhere in the world";
    const postMoney = "$ " + data.money.totalCoin;
    let groupAvatar = null;
    if (data.voteData.votedUsers.length != null) {
      groupAvatar = data.voteData.votedUsers.map(item => item.avatarUrl);
    }
    //calculate status of like/dislike...
    const likeButtonEnabled = data.voteData.upData.active === true;
    const dislikeButtonEnabled = data.voteData.downData.active === true;
    const callback = this.props.callback;
    const enabled = this.props.enabled;
    const onClose = this.props.onClose;
    const postTitle = user.fullName + " 's post";
    return (
      <View>
        <Modal animationType="fade" transparent={false} visible={enabled} onShow={this._initData}>
          <View
            style={{
              marginTop: CONSTANTS.SPARE_HEADER,
              flexDirection: "column",
              marginBottom: CONSTANTS.SPARE_FOOTER,
              flex: 1
            }}
          >
            <View
              style={{
                height: 46,
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 0.1,
                alignItems: "center"
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    // alignSelf: "flex-start",
                    marginLeft: 10
                  }}
                >
                  <Icon name="arrowleft" type="AntDesign" />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{postTitle}</Text>
              </View>

              <Icon
                name="dots-three-vertical"
                type="Entypo"
                style={{
                  fontSize: 16,
                  fontWeight: "200",
                  marginRight: 10,
                  marginTop: 10
                }}
              />
            </View>
            {/* change to flex 0.5 on Android */}
            <ScrollView style={{ flex: 0.8 }} ref={this.myScroll}>
              <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
                <Text>{data.content}</Text>
              </View>
              <PeertalMediaCarousel data={data.media} />
              <View style={{ flexDirection: "row", marginLeft: 12, height: 30 }}>
                <LikeDislikeButton onPress={this.handleVoteButton} type="like" active={likeButtonEnabled} />
                <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{votedNo}</Text>
                <LikeDislikeButton onPress={this.handleDislikeButton} type="dislike" active={dislikeButtonEnabled} />
                <LikeDislikeButton type="comment" active={true} style={{ marginLeft: 8 }} />
                <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{commentNo}</Text>
                <LikeDislikeButton
                  type="share"
                  onPress={() => {
                    Share.share({ title: "hellow", message: "helloworld" });
                  }}
                  active={true}
                  style={{ marginLeft: 8 }}
                />
                <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{commentNo}</Text>
                <View style={{ position: "absolute", right: 16 }}>
                  <GroupAvatars data={groupAvatar} />
                </View>
              </View>
              <View>{this._renderCommentItem()}</View>
              {this._renderReplyBump()}

              <View style={{ minHeight: 80, backgroundColor: "white" }} />
            </ScrollView>
            <View style={{ flex: 0.1 }}>
              <CommentInputItem
                postID={this.props.data.id}
                data={this.props.data}
                callback={this._loadData}
                onFocus={() => this.setState({ focus: "comment" })}
                onBlur={() => this.setState({ focus: "" })}
                navigation={this.props.navigation}
              />
              {/* <View style={{ minHeight: 50, backgroundColor: "white" }} /> */}
            </View>
            {this._renderKeyboardBump()}
            {/* <KeyboardAvoidingView enabled={CONSTANTS.OS == "ios"} /> */}
            {/* <KeyboardAvoidingView
              enabled={CONSTANTS.OS == "ios"}
              style={{ flex: 0.25 }}
              behavior="position"
              contentContainerStyle={{
                position: "absolute",
                bottom: 200,
                backgroundColor: "white",
                width: CONSTANTS.WIDTH
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 15
                }}
              >
                <Image source={require("../assets/xd/Icons/camera.png")} />
                <Image source={require("../assets/xd/Icons/photo.png")} />
                <Image source={require("../assets/xd/Icons/play_button.png")} />
                <Image source={require("../assets/xd/Icons/tag_button.png")} />
                <Image source={require("../assets/xd/Icons/incognito_button.png")} />
              </View>
              <View style={{ minHeight: 50, backgroundColor: "white" }} />
            </KeyboardAvoidingView> */}
          </View>
        </Modal>
      </View>
    );
  }
}
