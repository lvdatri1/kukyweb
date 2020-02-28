import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, ImageBackground, Clipboard } from "react-native";
import { Text } from "./CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";

export default class WalletInfoModal extends Component {
  render() {
    const data = this.props.data || {};
    const user = this.props.user;
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    const avatarUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const walletAddress = data.address;
    const WalletName = user.fullName;
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
                WALLET INFORMATION
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{ width: "100%", height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48, alignItems: "center" }}
          >
            <Image source={{ uri: avatarUrl }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 50 }} />
            <Text style={{ marginTop: 30, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{WalletName}</Text>
            <Image source={{ uri: qrImageUrl }} style={{ width: 200, height: 200, marginTop: 20 }} />
            <Text style={{ marginTop: 30, textAlign: "center", marginHorizontal: 15 }}>{description}</Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(walletAddress);
              }}
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
                Copy Wallet Address
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}
