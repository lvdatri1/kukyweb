import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, LoadingSpinner } from "../components/CoreUIComponents";
import { Icon } from "native-base";
import CONSTANTS from "../common/PeertalConstants";
import TopUpStep2Modal from "./TopUpStep2Modal";

export default class CreditCardItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topUpStep2Modal: false
    };
  }
  render() {
    const cardLogo = {
      visa: "https://revenuesandprofits.com/wp-content/uploads/2019/02/Visa.jpg",
      master: "https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_pos_92px_2x.png"
    };
    const data = this.props.data;
    const bank = data.fullName || "Full Name";
    const cardType = data.type || "visa";
    const cardNumber = data.cardNumber || "checking ***1293";

    return (
      <TouchableOpacity
        onPress={() => this.setState({ topUpStep2Modal: true })}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          marginHorizontal: 15,
          borderRadius: 10,
          backgroundColor: "white",
          width: CONSTANTS.WIDTH - 30,
          padding: 15,
          ...CONSTANTS.MY_SHADOW_STYLE
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Image source={{ uri: cardLogo[cardType] }} style={{ height: 40, width: 50, borderRadius: 10 }} />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{bank}</Text>
            <Text style={{ fontSize: 12 }}>{cardNumber}</Text>
          </View>
        </View>
        <Icon name="ios-arrow-forward" style={{ fontSize: 16 }} />
        <TopUpStep2Modal
          enabled={this.state.topUpStep2Modal}
          onClose={() => this.setState({ topUpStep2Modal: false })}
          user={this.props.user}
          data={this.props.data}
          walletData={this.props.walletData}
        />
      </TouchableOpacity>
    );
  }
}
