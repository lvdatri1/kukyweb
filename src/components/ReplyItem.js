import React, { Component } from "react";
import { View, Image } from "react-native";
import { Thumbnail, Icon } from "native-base";
import CONSTANTS from "../common/PeertalConstants";
import LikeDislikeButton from "./LikeDislikeButton";
import { voteToPost } from "../actions/userActions";
import { Text, ParsedText } from "./CoreUIComponents";
export default class ReplyItem extends Component {
  constructor(props) {
    super(props);
    this.handleVoteButton = this.handleVoteButton.bind(this);
    this.handleDislikeButton = this.handleDislikeButton.bind(this);
  }
  handleVoteButton() {
    voteToPost(
      this.props.user.accessToken,
      { id: this.props.data.id, value: "LIKE", type: "COMMENT" },
      res => {
        if (this.props.callback) {
          this.props.callback();
          return;
        }
        // alert('Liked ' + res.data.data.total);
        let response = res.data;
        if (response.status === 200) {
          let newPostData = this.props.data;
          newPostData.voteData.VOTE_LIKE_POST = res.data.data;
          this.props.dispatch({
            type: "UPDATE_COMMENTS_ONE_POST",
            data: { post: newPostData }
          });
        } else {
          alert(response.message);
        }

        // alert(this.props.data.voteData.VOTE_LIKE_POST.total)
      }
    );
  }
  handleDislikeButton() {
    voteToPost(
      this.props.user.accessToken,
      { id: this.props.data.id, value: "DISLIKE", type: "COMMENT" },
      res => {
        if (this.props.callback) {
          this.props.callback();
          return;
        }
        // alert('Liked ' + res.data.data.total);
        let response = res.data;
        if (response.status === 200) {
          let newPostData = this.props.data;
          newPostData.voteData.VOTE_LIKE_POST = res.data.data;
          this.props.dispatch({
            type: "UPDATE_COMMENTS_ONE_POST",
            data: { post: newPostData }
          });
        } else {
          alert(response.message);
        }

        // alert(this.props.data.voteData.VOTE_LIKE_POST.total)
      }
    );
  }
  render() {
    const data = this.props.data;
    const votedNo = data.voteData.total;
    const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);
    let fullName, avatarUrl;
    fullName = data.user.fullName;
    avatarUrl = data.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    //calculate status of like/dislike...
    const likeButtonEnabled = data.voteData.upData.active === true;
    const dislikeButtonEnabled = data.voteData.downData.active === true;
    const callback = this.props.callback;
    const content = data.content;

    return (
      <View
        key={data.id}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 10,
          marginHorizontal: 15
        }}
      >
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: 24,
            height: 24,
            borderRadius: 24 / 2,
            alignSelf: "flex-start"
          }}
        />
        <View>
          <View
            style={{
              width: CONSTANTS.WIDTH - 30 - 48 - 10 - 50,
              minHeight: 48,
              borderRadius: 6,
              backgroundColor: "#F3F4F4",
              marginHorizontal: 10,
              flexDirection: "column"
            }}
          >
            <View
              style={{
                marginHorizontal: 10,
                marginTop: 10,
                flexDirection: "row"
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {fullName}
              </Text>
              <Icon
                name="dot-single"
                type="Entypo"
                style={{
                  color: "gray",
                  fontSize: 14,
                  marginLeft: 15
                }}
              />
              <Text style={{ fontSize: 12, fontWeight: "200", color: "gray" }}>
                {timeAgo}
              </Text>
            </View>
            <ParsedText
              style={{
                marginHorizontal: 10,
                fontSize: 14,
                marginVertical: 8
              }}
            >
              {content}
            </ParsedText>
          </View>
          <View
            style={{ flexDirection: "row", marginHorizontal: 15, marginTop: 5 }}
          >
            <LikeDislikeButton
              onPress={this.handleVoteButton}
              type="like"
              active={likeButtonEnabled}
              callback={callback}
            />
            <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{votedNo}</Text>
            <LikeDislikeButton
              onPress={this.handleDislikeButton}
              type="dislike"
              active={dislikeButtonEnabled}
              callback={callback}
            />
          </View>
        </View>
      </View>
    );
  }
}
