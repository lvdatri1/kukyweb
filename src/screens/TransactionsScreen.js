import { Icon } from "native-base";
import React, { Component } from "react";
import { ImageBackground, ScrollView, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import CONSTANTS from "../common/PeertalConstants";
import { Text } from "../components/CoreUIComponents";
import TransactionItem from "../components/TransactionItems";

class TransactionsScreen extends Component {
  constructor(props) {
    super(props);
    this._renderItems = this._renderItems.bind(this);
  }
  _renderItems() {
    var data = [];
    for (let i = 1; i < 20; i++) data.push(i);
    return data.map((item, index) => <TransactionItem key={index} data={item} />);
  }
  render() {
    const dollarNumber = "10330,023.1";
    const currency = "AUD";
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
            <Text style={{ fontSize: 14, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, color: "black" }}>
              TRANSACTIONS
            </Text>
          </View>
        </View>
        <ImageBackground
          source={require("../assets/xd/background/Login-bg.png")}
          style={{ width: "100%", height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48 }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: 320 * CONSTANTS.WIDTH_RATIO,
              height: 120,
              margin: 23,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6
              },
              shadowOpacity: 0.37,
              shadowRadius: 7.49,

              elevation: 12
            }}
          >
            <Text style={{ marginTop: 25, marginLeft: 25, marginTop: 25, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
              Current Balance
            </Text>
            <View style={{ flexDirection: "row", marginLeft: 25 }}>
              <Icon
                name="attach-money"
                type="MaterialIcons"
                style={{ fontSize: 16, color: CONSTANTS.MY_BLUE, marginTop: 10 }}
              />
              <Text style={{ fontSize: 40, color: CONSTANTS.MY_BLUE }}>{dollarNumber}</Text>
              <Text style={{ color: CONSTANTS.MY_BLUE, alignSelf: "flex-end", marginBottom: 8, marginLeft: 5 }}>
                {currency}
              </Text>
            </View>
          </View>
          <ScrollView style={{}}>{this._renderItems()}</ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const TransactionsContainer = connect(mapStateToProps)(TransactionsScreen);
export default TransactionsContainer;
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
  },
  block: {
    height: 100,
    width: 100,
    backgroundColor: "red",
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    textAlign: "center"
  },
  blockText: {
    color: "white",
    textAlign: "center",
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 12,
    marginTop: 5
  }
};
