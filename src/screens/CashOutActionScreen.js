import { Icon } from "native-base";
import React, { Component } from "react";
import { Image, ImageBackground, TouchableOpacity, View, TextInput, ScrollView } from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { getWalletDetails, cashOutMoney } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import SuccessMessageObject from "../models/SuccessMessageObject";
import { LoadingSpinner, Text, RoundButton } from "../components/CoreUIComponents";

//@flow
class CashOutActionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amountDollar: "0",
      walletModal: false,
      ListTransactionModal: false,
      MyRequestMoneyModal: false,
      TopUpModal: false,
      bankAccount: {},
      cashOutModal: false,
      walletData: {},
      isLoading: false
    };
    this._loadingData = this._loadingData.bind(this);
    this._handleWithdraw = this._handleWithdraw.bind(this);
  }
  _handleWithdraw() {
    const exchangeRate = this.state.walletData.exchangeRate || 100;
    const coinValue = (this.state.amountDollar / exchangeRate).toFixed(6);
    const requestData = {
      amount: coinValue,
      currency: this.state.walletData.currency || "USD",
      reason: "cashout",
      bankAccountId: this.state.bankAccount.id
    };
    this.setState({ isLoading: true });
    cashOutMoney(
      this.props.user.accessToken,
      requestData,
      res => {
        this.setState({ isLoading: false, amountDollar: "0" });
        const messageSuccess = new SuccessMessageObject(
          "Success",
          undefined,
          "",
          "",
          "",
          "",
          "Money has been withdrew successfully. The money will be credited to your bank account in 5-10 business days. "
        );
        this.props.navigation.navigate("SuccessAction", {
          data: messageSuccess
        });
      },
      err => {
        this.setState({ isLoading: false });
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      }
    );
  }
  _loadingData() {
    this.setState({
      isLoading: true,
      bankAccount: this.props.navigation.getParam("data", {})
    });
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
    const dollarNumber = ((this.state.walletData.balance || 0) * exchangeRate).toFixed(2);
    const currency = this.state.walletData.currency || "USD";
    const bank = this.state.bankAccount.bankName;
    const cardNumber = this.state.bankAccount.accountNumber;

    const coinValue = (this.state.amountDollar / exchangeRate).toFixed(5) + "";
    const fee = (this.state.amountDollar * 0.03).toFixed(2) + "";

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
        <ScrollView>
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
                <Text style={{ fontSize: 40, color: CONSTANTS.MY_BLUE }}>{dollarNumber}</Text>
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
            <View />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                marginHorizontal: 15,
                //   borderRadius: 10,
                //   backgroundColor: "white",
                width: CONSTANTS.WIDTH - 30,
                padding: 15
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <Icon name="bank" type="FontAwesome" style={{ color: CONSTANTS.MY_BLUE }} />
                <View style={{ marginLeft: 15 }}>
                  <Text
                    style={{
                      fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                      color: CONSTANTS.MY_BLUE
                    }}
                  >
                    {bank}
                  </Text>
                  <Text style={{ fontSize: 12, color: CONSTANTS.MY_BLUE }}>{cardNumber}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 15,
                borderTopColor: "gray",
                borderTopWidth: 1,
                marginTop: 10
              }}
            >
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
                    this.setState({
                      amountDollar: text,
                      coinValue: (text / exchangeRate).toFixed(5)
                    })
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
              <Text style={{ marginVertical: 10 }}>Fee: ~${fee}</Text>
              <RoundButton text={"Withdraw Now"} onPress={this._handleWithdraw} />
            </View>
          </ImageBackground>
        </ScrollView>

        {/* {this.state.isLoading ? <OverlayLoading /> : null} */}
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const CashOutActionContainer = connect(mapStateToProps)(CashOutActionScreen);
export default CashOutActionContainer;
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
  },
  step: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_BLUE,
    marginLeft: -40,
    alignItems: "center",
    justifyContent: "center"
  },
  stepText: {
    color: "white",
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
  },
  stepNoActive: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_GRAYBG,
    marginLeft: -40,
    alignItems: "center",
    justifyContent: "center"
  },
  stepNoActiveText: {
    color: CONSTANTS.MY_GREY,
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
  },
  textInput: {
    padding: 5,
    width: "100%",
    borderRadius: 5,
    // minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "black",
    marginTop: 10
  },
  dollarInput: {
    // padding: 5,
    width: "50%",
    textAlign: "right",
    // marginTop: 10
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
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
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10
  }
};
