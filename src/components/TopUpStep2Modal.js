import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, ImageBackground, TextInput } from "react-native";
import { Text, LoadingSpinner } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { topUpCard } from "../actions/userActions";

export default class TopUpStep2Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkCreditCardModal: false,
      amountDollar: "0.0",
      isLoading: false
    };
    this._handleTopUp = this._handleTopUp.bind(this);
  }
  _handleTopUp() {
    const exchangeRate = this.props.walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
    const coinValue = (this.state.amountDollar / exchangeRate).toFixed(5);

    this.setState({ isLoading: true });
    topUpCard(
      this.props.user.accessToken,
      this.props.data.id,
      coinValue,
      res => {
        alert("top up successfully");
        this.setState({ isLoading: false });
      },
      err => {
        this.setState({ isLoading: false });
        alert("error when top up with " + err.message);
      }
    );
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;

    const walletData = this.props.walletData || {};
    const exchangeRate = walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
    const dollarNumber = ((walletData.balance || 0) * exchangeRate).toFixed(2);
    const currency = walletData.currency || "USD";
    const data = this.props.data || {};
    const cardLogo = CONSTANTS.CARD_LOGOS[data.type];
    const cardNumber = data.cardNumber;
    const fullName = data.fullName;
    const coinValue = (this.state.amountDollar / exchangeRate).toFixed(5) + "";
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
                TOP UP STEP 2
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{ width: "100%", height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48, alignItems: "center" }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: (320 / 375) * CONSTANTS.WIDTH, //corrected ratio
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
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 15,
                alignSelf: "flex-start",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Image source={cardLogo} style={{ height: 15, width: 50, marginRight: 20 }} />
              <View>
                <Text style={styles.cardText}>{fullName}</Text>
                <Text style={styles.cardText}>{cardNumber}</Text>
              </View>
            </View>
            <View style={{ height: 20, borderBottomWidth: 1, borderBottomColor: CONSTANTS.MY_GREY, width: "100%" }} />
            <View style={{ width: "100%", paddingHorizontal: 15 }}>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Icon style={{ fontSize: 20 }} name="money" type="FontAwesome" />
                <Text style={{ marginLeft: 10 }}>Add the amount of money</Text>
              </View>
              <View
                style={{
                  ...styles.dollarBox
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon
                      name="dollar"
                      type="FontAwesome"
                      style={{
                        fontSize: 16
                      }}
                    />
                  </View>
                  <Text style={{ marginLeft: 5 }}>{currency}</Text>
                </View>

                <TextInput
                  style={{ ...styles.dollarInput }}
                  value={this.state.amountDollar}
                  keyboardType="numeric"
                  onChangeText={text =>
                    this.setState({ amountDollar: text, coinValue: (text / exchangeRate).toFixed(5) })
                  }
                  placeholder="0.00"
                />
              </View>
              <View
                style={{
                  ...styles.dollarBox
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text> </Text>
                </View>

                <TextInput
                  style={{ ...styles.dollarInput }}
                  value={coinValue}
                  editable={false}
                  // onChangeText={text => this.setState({ amountDollar: text })}
                  placeholder="0.00"
                />
              </View>
            </View>
            {this.state.isLoading ? (
              <LoadingSpinner />
            ) : (
              <TouchableOpacity
                onPress={this._handleTopUp}
                style={{
                  width: "70%",
                  height: 50,
                  borderRadius: 25,
                  marginTop: 30,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14 }}>
                  Top Up Now
                </Text>
              </TouchableOpacity>
            )}
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}
const styles = {
  cardText: {
    color: CONSTANTS.MY_BLUE
  },
  dollarInput: {
    // padding: 5,
    width: "50%",
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    textAlign: "right"
    // marginTop: 10
  },
  dollarBox: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-between",
    borderRadius: 5,
    minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "black",
    paddingHorizontal: 10
  }
};
