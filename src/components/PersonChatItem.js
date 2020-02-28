import { Icon } from "native-base";
import React, { Component } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CONSTANTS from "../common/PeertalConstants";

//@flow
export default class PersonChatItem extends Component {
  constructor(props) {
    super(props);

    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  handleTouchOnAvatar() {
    // const pushAction = StackActions.push({
    //   routeName: "UserProfile",
    //   params: {
    //     userId: this.props.data.id
    //   }
    // });
    // this.props.navigation.dispatch(pushAction);
    // this.props.navigation.navigate("UserProfile", { userId: this.props.data.id });
  }
  handleCheck() {
    // this.props.callback(this.props.index, !this.props.data.checked);
    this.props.callback();
  }

  render() {
    // console.log("here is data", this.props.data.lastMessage);
    const { data, callback, user } = this.props; //equal to channel
    const members = data.members.filter(item => item.userId != user.userId);
    if (members.length == 0) return null;
    const firstMem = members[0];
    const avatarSource = firstMem.profileUrl || CONSTANTS.RANDOM_IMAGE;
    // const fullName = firstMem.nickname || "Name";
    let fullName = "";
    members.forEach(item => {
      fullName += item.nickname + ", ";
    });
    let message = "...";
    let timeAgo = "now";

    const lastMessage = data.lastMessage;
    if (lastMessage) {
      timeAgo = CONSTANTS.getTimeDifference(Number(lastMessage.createdAt));
      message = lastMessage.message;
    }
    const unreadCount = data.unreadMessageCount || 0;

    return (
      <TouchableOpacity
        onPress={this.handleCheck}
        style={{
          //flex to be square
          backgroundColor: "white",
          borderRadius: 10,
          flexDirection: "row",
          margin: 15,
          padding: 15,
          justifyContent: "flex-start",
          ...CONSTANTS.MY_SHADOW_STYLE
        }}
      >
        <Image source={{ uri: avatarSource }} style={{ width: 50, height: 50, borderRadius: 25 }} />

        <View style={{ marginHorizontal: 10, width: CONSTANTS.WIDTH - 100 }}>
          <View>
            <View style={{ flexDirection: "row", width: CONSTANTS.WIDTH - 120, justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", marginRight: 5, maxWidth: CONSTANTS.WIDTH - 240 }}>{fullName}</Text>
                {unreadCount > 0 ? (
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: "red",

                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12
                      }}
                    >
                      {unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_LIGHT }}>{timeAgo}</Text>
            </View>
            <Text>{message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  unChecked: {
    backgroundColor: CONSTANTS.MY_GRAYBG,
    color: CONSTANTS.MY_GRAYBG,
    fontSize: 40,
    paddingRight: 15
  },
  checked: {
    // backgroundColor: "white",
    color: CONSTANTS.MY_BLUE,
    fontSize: 35
  }
};
