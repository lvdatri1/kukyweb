import { Icon } from "native-base";
import React, { Component } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import CONSTANTS from "../common/PeertalConstants";
import BankAccountItem from "../components/BankAccountItem";
import { Text } from "../components/CoreUIComponents";
import { getBankAccounts } from "../actions/userActions";
import { ScrollView } from "react-native-gesture-handler";

class CashOutStep1Screen extends Component {
  constructor(props) {
    super(props);
    this.state = { bankAccounts: [], isLoading: false };
    this.handleLoadingData = this.handleLoadingData.bind(this);
    this._renderCards = this._renderCards.bind(this);
  }
  handleLoadingData() {
    this.setState({ isLoading: true });
    getBankAccounts(
      this.props.user.accessToken,
      res => {
        this.setState({ bankAccounts: res.data.data.list, isLoading: false });
      },
      err => {
        this.setState({ isLoading: false });
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      }
    );
  }
  _renderCards() {
    const data = this.state.bankAccounts;
    return data.map((item, index) => (
      <BankAccountItem
        data={item}
        key={index}
        navigation={this.props.navigation}
      />
    ));
  }
  render() {
    const description = "We keep your financial details more secure";
    const title = "Please use Bank Account to cash out";
    return (
      <View style={{ flexDirection: "column", height: "100%" }}>
        <NavigationEvents
          onWillFocus={() => {
            this.handleLoadingData();
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
              CASH OUT
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
            style={{ marginTop: 15, textAlign: "center", marginHorizontal: 15 }}
          >
            {description}
          </Text>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this.handleLoadingData}
              />
            }
            style={{ width: CONSTANTS.WIDTH }}
          >
            {this._renderCards()}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("LinkNewBank")}
              style={{
                width: "70%",
                height: 50,
                borderRadius: 20,
                marginTop: 30,
                backgroundColor: CONSTANTS.MY_BLUE,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: 14
                }}
              >
                Link Other Bank Account
              </Text>
            </TouchableOpacity>
            <View style={{ height: 50 }} />
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
const mapStateToProps = store => ({
  user: store.user
});
const CashOutStep1Container = connect(mapStateToProps)(CashOutStep1Screen);
export default CashOutStep1Container;
