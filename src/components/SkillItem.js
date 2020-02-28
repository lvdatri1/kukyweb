import { Icon } from "native-base";
import React, { Component } from "react";
import ActionSheet from "react-native-actionsheet";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../components/CoreUIComponents";
import LikeDislikeButton from "./LikeDislikeButton";
export default class SkillItem extends Component {
  constructor(props) {
    super(props);
    this.handleVoteButton = this.handleVoteButton.bind(this);
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  handleVoteButton() {
    alert("fun");
  }
  handleDislikeButton() {
    alert("dislike");
  }
  render() {
    const data = this.props.data;
    console.log("skillx", data);
    const votedNo = data.voteData.total;
    const likeButtonEnabled = data.voteData.upData.active;
    const dislikeButtonEnabled = data.voteData.downData.active;
    const name = data.name;
    const onLikeAction = this.props.onLikeAction || this.handleVoteButton;
    const onDislikeAction = this.props.onDisLikeAction || this.handleVoteButton;
    const onReportAction = this.props.onReportAction || this.handleVoteButton;
    const onDeleteAction = this.props.onDeleteAction || this.handleVoteButton;

    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <LikeDislikeButton onPress={() => onLikeAction()} type="like" active={likeButtonEnabled} />
          <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{votedNo}</Text>
          <LikeDislikeButton onPress={() => onDislikeAction()} type="dislike" active={dislikeButtonEnabled} />
          <Text style={{ marginLeft: 15 }}>{name}</Text>
        </View>
        <TouchableOpacity onPress={this.showActionSheet}>
          <Icon name="dots-three-vertical" type="Entypo" style={{ fontSize: 16, fontWeight: "200" }} />
        </TouchableOpacity>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={"Which action do you like to do?"}
          options={["Report", "cancel"]}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={index => {
            /* do something */
            if (index === 0) onReportAction();
            //if (index === 1) onDeleteAction();
          }}
        />
      </View>
    );
  }
}
