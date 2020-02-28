import React, { Component } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";

import { StackActions } from "react-navigation";
//@flow
export default class PersonTagItem extends Component {
  constructor(props) {
    super(props);

    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  handleTouchOnAvatar() {}
  handleCheck() {
    this.props.callback(this.props.index, !this.props.data.checked);

    //   callback()
  }

  render() {
    const { data } = this.props;
    const avatarSource = data.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = data.fullName || "Name";
    const occupation = data.occupation || "Global citizen";
    const locationAddress = data.locationAddress || "somewhere in the world";
    const introduction = data.introduction || "...";
    const checked = data.checked;
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

        <View style={{ marginLeft: 10, width: CONSTANTS.WIDTH - 30 - 50 - 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View>
              <Text style={{fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{fullName}</Text>
              <View style={{ flexDirection: "row" }}>
                <Icon name="ios-briefcase" style={{ fontSize: 14, color: CONSTANTS.MY_GREY, paddingLeft: 3 }} />
                <Text style={{ marginLeft: 10, color: CONSTANTS.MY_GREY, fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM }}>{occupation}</Text>
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
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM
                  }}
                >
                  {locationAddress}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: CONSTANTS.MY_GRAYBG,
                height: 32,
                width: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 15
              }}
            >
              {checked ? <Icon name="ios-checkmark-circle" type="Ionicons" style={styles.checked} /> : null}
            </View>
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
