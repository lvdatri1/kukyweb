import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import CreditCardItem from "../components/CreditCardItem";
import LinkCreditCardModal from "../components/LinkCreditCardModal";

export default class TopUpStep1Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkCreditCardModal: false
    };
  }
  _renderCards() {
    const data = this.props.data || [];
    return data.map((item, index) => (
      <CreditCardItem
        data={item}
        key={index}
        walletData={this.props.walletData}
        user={this.props.user}
      />
    ));
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;

    const description = "We keep your financial details more secure";

    const title = "Please use Credit Cards to Top Up";

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
              <Icon
                name="arrowleft"
                type="AntDesign"
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 0,
                width: CONSTANTS.WIDTH - 15 - 30 - 30,
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  color: "black"
                }}
              >
                TOP UP
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{
              width: "100%",
              height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
              alignItems: "center"
            }}
          >
            <Text
              style={{
                marginTop: 50,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                color: "black"
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                marginTop: 15,
                textAlign: "center",
                marginHorizontal: 15
              }}
            >
              {description}
            </Text>
            {this._renderCards()}
            <TouchableOpacity
              onPress={() => this.setState({ linkCreditCardModal: true })}
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
              <Text
                style={{
                  color: "white",
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: 14
                }}
              >
                Link Other Card
              </Text>
            </TouchableOpacity>
          </ImageBackground>
          <LinkCreditCardModal
            enabled={this.state.linkCreditCardModal}
            onClose={() => this.setState({ linkCreditCardModal: false })}
            user={this.props.user}
          />
        </View>
      </Modal>
    );
  }
}
