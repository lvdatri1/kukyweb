import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import CreditCardItem from "../components/CreditCardItem";

import { connect } from "react-redux";
import { getWalletDetails } from "../actions/userActions";

class TopUpStep1Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkCreditCardModal: false,
      walletData: {},
      isLoading: false
    };
    this._initData = this._initData.bind(this);
  }
  _initData() {
    //init data here
    this.setState({ isLoading: true });
    getWalletDetails(
      this.props.user.accessToken,
      res => {
        this.setState({ walletData: res.data.data, isLoading: false });
      },
      err => {
        this.setState({ isLoading: false });
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      }
    );
  }
  _renderCards() {
    const data = this.state.walletData.cards || [];
    return data.map((item, index) => (
      <CreditCardItem
        data={item}
        key={index}
        walletData={this.state.walletData}
        user={this.props.user}
      />
    ));
  }
  render() {
    const description = "We keep your financial details more secure";
    const title = "Please use Credit Cards to Top Up";

    return (
      <View>
        <NavigationEvents onWillFocus={this._initData} />
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
              onPress={() => this.props.navigation.navigate("LinkCreditCard")}
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
        </View>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const TopUpStep1Container = connect(mapStateToProps)(TopUpStep1Screen);
export default TopUpStep1Container;
