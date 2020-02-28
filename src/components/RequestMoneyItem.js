import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import CONSTANTS from "../common/PeertalConstants";
import { Text } from "../components/CoreUIComponents";
import TransactionItemModal from "../components/TransactionItemModal";
import { RoundButton } from "../components/CoreUIComponents";
import { Row } from "native-base";

export default class TransactionItems extends Component {
  constructor(props) {
    super(props);
    this.state = { popUp: false, extended: false };
  }

  render() {
    const data = this.props.data;
    const { receiver, sender, amount, createdAt, status, type, reason, exchangeRate } = data;
    const user = type == "send" ? receiver : sender;
    const newDate = new Date(createdAt).toLocaleString("en-GB", { dateStyle: "full" });
    console.log("data is createdAt", createdAt);
    const dollarAmount = (amount * exchangeRate).toFixed(2);
    return (
      <View>
        <View
          style={{
            marginHorizontal: 15,
            marginVertical: 10,
            borderRadius: 10,
            backgroundColor: "white",
            ...CONSTANTS.MY_SHADOW_STYLE
          }}
          // flexDirection: "row",
          // alignItems: "center",}}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: user.avatarUrl || CONSTANTS.DEFAULT_AVATAR }}
              style={{ width: 50, height: 50, borderRadius: 25, margin: 15 }}
            />
            <TouchableOpacity
              onPress={() => this.setState({ extended: !this.state.extended })}
              style={{ width: CONSTANTS.WIDTH - 30 - 80, paddingRight: 15 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{user.fullName}</Text>
                <Text>{dollarAmount}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text>{status}</Text>
                <Text>{newDate}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.state.extended ? (
            <View style={{ alignItems: "center", margin: 15 }}>
              <Text>{reason}</Text>
              {/* <RoundButton
                style={{ marginHorizontal: 20, marginBottom: 20 }}
                onPress={() => alert("touch on my button")}
                text={"Action"}
              /> */}
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
