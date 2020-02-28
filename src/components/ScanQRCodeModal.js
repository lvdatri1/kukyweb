import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, ImageBackground } from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";

export default class ScanQRCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = { myCodeTab: true };
  }
  _setTab(value) {
    this.setState({ myCodeTab: value });
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    const dollarNumber = "10330,023.1";
    const currency = "AUD";
    const avatarUrl = "https://picsum.photos/200";
    const walletAddress = "xxredsfsdfs";
    const WalletName = "HELLOE MASTER";
    const description = "show this to other people so they can find you on the network";
    const qrImageUrl = CONSTANTS.GENERATE_QR_CODE_API + walletAddress;

    return (
      <Modal animationType="slide" transparent={false} visible={showUp}>
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
            <TouchableOpacity onPress={() => onClose()}>
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
              <Text style={{ fontSize: 14, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, color: "black" }}>
                SCAN QR CODE
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{ width: "100%", height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48, alignItems: "center" }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity onPress={() => this._setTab(true)}>
                <Text style={this.state.myCodeTab ? styles.activeTab : styles.notActiveTab}>{"My Code"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._setTab(false)}>
                <Text style={!this.state.myCodeTab ? styles.activeTab : styles.notActiveTab}>{"Scan Code"}</Text>
              </TouchableOpacity>
            </View>

            <Image source={{ uri: qrImageUrl }} style={{ width: 200, height: 200, marginTop: 50 }} />
            <Text style={{ marginTop: 30, textAlign: "center" }}>{description}</Text>
            <TouchableOpacity
              style={{
                width: "70%",
                height: 50,
                borderRadius: 20,
                marginTop: 30,
                backgroundColor: CONSTANTS.MY_BLUE,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14 }}>
                Share my code
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}

const styles = {
  activeTab: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 22,
    margin: 15,
    color: CONSTANTS.MY_HEAD_TITLE_COLOR,
  },
  notActiveTab: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 22,
    margin: 15,
    color: CONSTANTS.MY_HEAD_TITLE_COLOR,
    opacity: 0.2,
  }
};
