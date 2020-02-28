import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { Text } from "./CoreUIComponents";
import { goToPage } from "../actions/userActions";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          height: 34,
          backgroundColor: CONSTANTS.MY_GRAYBG,
          width: CONSTANTS.WIDTH - 30 - 34,
          borderRadius: 17
        }}
      >
        <TouchableOpacity
          onPress={() => {
            goToPage(this.props.navigation, "Search");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "100%",
            row: "100%"
          }}
        >
          <Text style={{ fontSize: 12, color: "gray", alignSelf: "center" }}>Search</Text>
          <Icon name="search" type="EvilIcons" style={{ marginTop: 6, marginRight: 10 }} />
        </TouchableOpacity>
        {/* <SearchActionModal
          navigation={this.props.navigation}
          enabled={this.state.searActionModal}
          onClose={() => this.setState({ searActionModal: false })}
        /> */}
      </View>
    );
  }
}
