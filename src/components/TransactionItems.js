import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import CONSTANTS from "../common/PeertalConstants";
import { Text } from "../components/CoreUIComponents";
import TransactionItemModal from "../components/TransactionItemModal";
import UserObject from "../models/UserObject";
//@flow

export default class TransactionItems extends Component {
  constructor(props) {
    super(props);
    this.state = { popUp: false };
  }

  render() {
    const data = this.props.data;
    const user = (data.totalCoin < 0 ? data.receiver : data.sender) || new UserObject();
    const avatarUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = user.fullName;
    const createdAt = data.createdAt;
    const amount = (data.totalCoin * this.props.exchangeRate).toFixed(2) + " " + this.props.currency;
    const status = data.totalCoin > 0 ? "Received" : "Sent";
    return (
      <View
        style={{
          marginHorizontal: 15,
          marginTop: 20,
          borderRadius: 10,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7
        }}
      >
        <Image source={{ uri: avatarUrl }} style={{ width: 50, height: 50, borderRadius: 25, margin: 15 }} />
        <TouchableOpacity
          onPress={() => this.setState({ popUp: true })}
          style={{ width: CONSTANTS.WIDTH - 30 - 80, paddingRight: 15 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{fullName}</Text>
            <Text>{amount}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: status == "Received" ? "green" : "red" }}>{status}</Text>
            <Text>{createdAt}</Text>
          </View>
        </TouchableOpacity>
        <TransactionItemModal
          enabled={this.state.popUp}
          onClose={() => this.setState({ popUp: false })}
          data={this.props.data}
        />
      </View>
    );
  }
}
