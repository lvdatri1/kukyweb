import React, { Component } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { StackActions } from "react-navigation";
import { goToProfile } from "../actions/userActions";
//@flow
export default class PersonRowItem extends Component {
  constructor(props) {
    super(props);
    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
  }
  handleTouchOnAvatar() {
    // const pushAction = StackActions.push({
    //   routeName: "UserProfile",
    //   params: {
    //     userId: this.props.data.id
    //   }
    // });
    // this.props.navigation.dispatch(pushAction);
    goToProfile(this.props.navigation, this.props.data.id);
    // this.props.navigation.navigate("UserProfile", { userId: this.props.data.id });
  }

  render() {
    const { data } = this.props;
    const avatarSource = data.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = data.fullName;
    const occupation = data.occupation || "Global citizen";
    const locationAddress = data.address || "somewhere in the world";
    const introduction = data.introduction || "...";
    return (
      <View
        style={{
          //flex to be square
          backgroundColor: "white",
          borderRadius: 10,
          flexDirection: "row",
          margin: 15,
          padding: 15,
          justifyContent: "flex-start"
        }}
      >
        <TouchableOpacity onPress={this.handleTouchOnAvatar}>
          <Image source={{ uri: avatarSource }} style={{ width: 50, height: 50, borderRadius: 25 }} />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, width: CONSTANTS.WIDTH - 30 - 50 - 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{fullName}</Text>
            <Icon name="dots-three-vertical" type="Entypo" style={{ fontSize: 14, paddingRight: 10 }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Icon name="ios-briefcase" style={{ fontSize: 14, color: CONSTANTS.MY_GREY, paddingLeft: 3 }} />
            <Text style={{ marginLeft: 10, color: CONSTANTS.MY_GREY, fontSize: 12 }}>{occupation}</Text>
          </View>
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <Icon
              name="location-on"
              type="MaterialIcons"
              style={{
                fontSize: 14,
                color: CONSTANTS.MY_GREY
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                color: CONSTANTS.MY_GREY,
                maxWidth: "90%",
                fontSize: 12
              }}
            >
              {locationAddress}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: 14
              }}
            >
              {introduction}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
