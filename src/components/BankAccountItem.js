import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "../components/CoreUIComponents";
import { Icon } from "native-base";
import CONSTANTS from "../common/PeertalConstants";

export default class BankAccountItem extends Component {
  render() {
    const cardLogo = {
      visa:
        "https://revenuesandprofits.com/wp-content/uploads/2019/02/Visa.jpg",
      master:
        "https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_pos_92px_2x.png"
    };
    const data = this.props.data;
    const bank = data.bankName;
    const cardNumber = data.accountNumber;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("CashOutAction", { data: data })
        }
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
          <Icon name="bank" type="FontAwesome" />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
              {bank}
            </Text>
            <Text style={{ fontSize: 12 }}>{cardNumber}</Text>
          </View>
        </View>
        <Icon name="ios-arrow-forward" style={{ fontSize: 16 }} />
      </TouchableOpacity>
    );
  }
}
