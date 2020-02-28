import React, { Component } from "react";
import { Image, Keyboard, TextInput, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { createCommentOnAPost } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";

class CommentInputItem extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    this.onCommentAction = this.onCommentAction.bind(this);
  }
  onCommentAction() {
    var commentData = {
      content: this.state.text,
      objectId: this.props.postId,
      isIncognito: false,
      parentCommentId: this.props.commentId || 0,
      objectType: "POST"
    };
    createCommentOnAPost(this.props.user.accessToken, commentData, res => {
      //after successfull commented, we will add comment to posts' Reducer
      if (this.props.callback) {
        // alert("comment is done cool");
        // this.setState({ text: "" });
        this.props.callback();
        return;
      }
      // Keyboard.dismiss();
    });
    this.setState({ text: "" });
  }

  render() {
    const user = this.props.user;
    const avatarUrl = user.avatarUrl;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          //   justifyContent: "space-between",
          marginTop: 10,
          marginHorizontal: 15
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 24 / 2,
              alignSelf: "flex-start"
            }}
          />
          <View
            style={{
              marginHorizontal: 15,
              height: 42,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-start",
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 20
            }}
          >
            <TextInput
              placeholder="Leave a reply..."
              returnKeyType={"send"}
              onSubmitEditing={this.onCommentAction}
              onKeyPress={e => {
                if (e.nativeEvent.key == "Enter") {
                  Keyboard.dismiss();
                  this.onCommentAction();
                }
              }}
              value={this.state.text}
              onChangeText={text =>
                this.setState({
                  text: text
                })
              }
              style={{
                color: "gray",
                marginLeft: 10,
                paddingTop: 0,
                fontSize: 14,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                width: 200 * CONSTANTS.WIDTH_RATIO
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{ marginTop: 10, marginRight: 16, width: 50, height: 35 }}
          onPress={this.onCommentAction}
        >
          <Image source={require("../assets/xd/Icons/sent-mail.png")} />
        </TouchableOpacity>
      </View>
    );
  }
}
const MapStateToProps = store => ({ user: store.user });
const CommentInputContainer = connect(MapStateToProps)(CommentInputItem);
export default CommentInputContainer;
