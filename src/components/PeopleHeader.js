import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import CONSTANTS from "../common/PeertalConstants";
import { refreshPosts } from "../actions/postActions";
import { Text } from "./CoreUIComponents";
class PeopleHeader extends Component {
  constructor(props) {
    super(props);
    this.handleSelectType = this.handleSelectType.bind(this);
  }
  handleSelectType(sType) {
    this.props.callback(sType);
    // this.props.dispatch(
    //   refreshPosts(this.props.user.accessToken, sType, this.props.user.longitude, this.props.user.latitude, 100)
    // );
  }

  render() {
    const currentTab = this.props.currentTab || "friend";
    return (
      <View style={{ height: 68 }}>
        <ScrollView pagingEnabled={true} style={{ height: "100%" }} horizontal={true}>
          <TouchableOpacity
            onPress={() => this.handleSelectType("friend")}
            style={{
              flexDirection: "row",
              height: 68,
              alignItems: "center",
              marginLeft: currentTab == "friend" ? 23 : -60,
              marginRight: 15,
            }}
          >
            <Text
              style={{
                ...styles.header,
                color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                opacity: currentTab == "friend" ? 1 : 0.2
              }}
            >
              My Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleSelectType("suggest")}
            style={{
              flexDirection: "row",
              height: 68,
              alignItems: "center",
              marginLeft: 15,
              marginRight: 30
            }}
          >
            <Text
              style={{
                ...styles.header,
                color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                opacity: currentTab == "suggest" ? 1 : 0.2
              }}
            >
              Suggested Friends
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const MapStateToProps = store => ({ user: store.user });
const PeopleHeaderContainer = connect(MapStateToProps)(PeopleHeader);
export default PeopleHeaderContainer;

const styles = {
  header: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 24
  }
};
