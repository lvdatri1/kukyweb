import { Icon } from "native-base";
import React, { Component } from "react";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { getWalletDetails } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import { LoadingSpinner, Text } from "../components/CoreUIComponents";
import ListTransactionModal from "../components/ListTransactionsModal";
import MyWalletQRCode from "../components/MyWalletQRCode";

//@flow
class WalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletModal: false,
      ListTransactionModal: false,
      MyRequestMoneyModal: false,
      TopUpModal: false,

      cashOutModal: false,
      walletData: {},
      isLoading: false
    };
    this._loadingData = this._loadingData.bind(this);
  }
  _loadingData() {
    this.setState({ isLoading: true });
    getWalletDetails(
      this.props.user.accessToken,
      res => {
        this.setState({ walletData: res.data.data, isLoading: false });
      },
      err => {
        alert("error with loading wallet " + err.message);
        this.setState({ isLoading: false });
      }
    );
  }
  componentDidMount() {
    this._loadingData();
  }
  render() {
    const exchangeRate = this.state.walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
    const dollarNumber = (
      (this.state.walletData.balance || 0) * exchangeRate
    ).toFixed(2);
    const currency = this.state.walletData.currency || "USD";
    return (
      <View style={{ flexDirection: "column", height: "100%" }}>
        <NavigationEvents
          onWillFocus={() => {
            this._loadingData();
          }}
        />
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
              WALLET
            </Text>
          </View>
        </View>
        <ImageBackground
          source={require("../assets/xd/background/Login-bg.png")}
          style={{
            width: "100%",
            height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
          }}
        >
          {this.state.isLoading ? <LoadingSpinner /> : null}
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
            <Text
              style={{
                marginTop: 25,
                marginLeft: 25,
                marginTop: 25,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
              }}
            >
              Current Balance
            </Text>
            <View style={{ flexDirection: "row", marginLeft: 25 }}>
              <Icon
                name="attach-money"
                type="MaterialIcons"
                style={{
                  fontSize: 16,
                  color: CONSTANTS.MY_BLUE,
                  marginTop: 10
                }}
              />
              <Text style={{ fontSize: 40, color: CONSTANTS.MY_BLUE }}>
                {dollarNumber}
              </Text>
              <Text
                style={{
                  color: CONSTANTS.MY_BLUE,
                  alignSelf: "flex-end",
                  marginBottom: 8,
                  marginLeft: 5
                }}
              >
                {currency}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 40
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ ListTransactionModal: true })}
                style={{ ...styles.block, backgroundColor: CONSTANTS.MY_BLUE }}
              >
                <Image
                  source={require("../assets/icon/transaction_icon.png")}
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                />
                <Text style={{ ...styles.blockText }}>Transactions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ walletModal: true })}
                style={{ ...styles.block, backgroundColor: "#5918E8" }}
              >
                <Image
                  source={require("../assets/icon/wallet_icon.png")}
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                />
                <Text style={{ ...styles.blockText }}>Wallet Information</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("RequestMoney")}
                style={{ ...styles.block, backgroundColor: "#BA27FF" }}
              >
                <Image
                  source={require("../assets/icon/request_money_icon.png")}
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                />
                <Text style={{ ...styles.blockText }}>Request Money</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 20
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("TopUpStep1")}
                style={{ ...styles.block, backgroundColor: "#FF00B4" }}
              >
                <Image
                  source={require("../assets/icon/top_up_icon.png")}
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                />
                <Text style={{ ...styles.blockText }}>Top Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SendMoney")}
                style={{ ...styles.block, backgroundColor: "#FF1A53" }}
              >
                <Image
                  source={require("../assets/icon/send_money_icon.png")}
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                />
                <Text
                  style={{
                    ...styles.blockText
                  }}
                >
                  Send Money
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("CashOutStep1", {
                    data: this.state.walletData.bankAccounts || [],
                    walletData: this.state.walletData
                  })
                }
                style={{ ...styles.block, backgroundColor: "#FF692F" }}
              >
                <Image
                  source={require("../assets/icon/atm_icon.png")}
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                />
                <Text style={{ ...styles.blockText }}>Cash Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <MyWalletQRCode
          enabled={this.state.walletModal}
          onClose={() => this.setState({ walletModal: false })}
          data={this.state.walletData}
          user={this.props.user}
        />
        <ListTransactionModal
          enabled={this.state.ListTransactionModal}
          onClose={() => this.setState({ ListTransactionModal: false })}
          data={this.state.walletData}
          user={this.props.user}
        />

        {/* {this.state.isLoading ? <OverlayLoading /> : null} */}
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
