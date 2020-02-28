import { Icon } from "native-base";
import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import CONSTANTS from "../common/PeertalConstants";

class WalletScreen extends Component {
  render() {
    return (
      <View style={{ flexDirection: "column", height: "100%" }}>
        <View
          style={{
            height: 48,
            marginTop: CONSTANTS.SPARE_HEADER,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            justifyContent: "flex-start",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 0,
              width: CONSTANTS.WIDTH - 15 - 30 - 30,
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>SETTINGS</Text>
          </View>
        </View>

        <Text
          style={{
            textAlign: "center",
            position: "absolute",
            bottom: 0,
            left: 0,
            marginBottom: CONSTANTS.SPARE_FOOTER,
            width: "100%",
            fontSize: 11,
            color: "gray"
          }}
        >
          You are using Kuky version 1.0.0. {"\n"}
          Made with love by a Global team. Copyright by Kuky@2019
        </Text>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const WalletContainer = connect(mapStateToProps)(WalletScreen);
export default WalletContainer;
const styles = {
  header1: {
    marginLeft: 16,
    color: CONSTANTS.MY_BLUE,
    fontSize: 18,
    marginTop: 30
  },
  header2: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 16
  },
  textItem: {
    fontSize: 14,
    marginLeft: 10
  }
};
