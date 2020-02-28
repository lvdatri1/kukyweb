import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import RequestMoneyItem from "../components/RequestMoneyItem";
import SortByButton from "../components/CoreUIComponents/SortByButton";
import RoundButton from "../components/CoreUIComponents/RoundButton";
import { getMoneyRequest } from "../actions/userActions";
import { NavigationEvents } from "react-navigation";

class RequestMoneyScreen extends Component {
  constructor(props) {
    super(props);
    this._renderItems = this._renderItems.bind(this);
    this.state = {
      myRequestTab: true,
      sortType: "all",
      requestList: [],
      isLoading: false
    };
    this._selectTab = this._selectTab.bind(this);
    this.setSortType = this.setSortType.bind(this);
    this._loadData = this._loadData.bind(this);
  }
  _loadData() {
    getMoneyRequest(
      this.props.user.accessToken,
      0,
      20,
      res => {
        this.setState({
          requestList: res.data.data.list,
          isLoading: false
        });
      },
      err => {
        this.setState({ isLoading: false });
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      }
    );
  }
  setSortType(type) {
    this.setState({ sortType: type });
  }
  _selectTab(value) {
    this.setState({ myRequestTab: value });
  }
  _renderItems() {
    const exchangeRate = this.props.user.settings.exchangeRate || 100;
    const tabType = this.state.myRequestTab ? "send" : "receive";
    var data = this.state.requestList.filter(item => item.type == tabType);
    return data.map((item, index) => (
      <RequestMoneyItem key={index} data={{ ...item, exchangeRate }} />
    ));
  }
  render() {
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <NavigationEvents onWillFocus={this._loadData} />
        <View
          style={{
            // height: 48,
            // flex: 48,
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
              REQUEST MONEY
            </Text>
          </View>
        </View>
        <ImageBackground
          source={require("../assets/xd/background/Login-bg.png")}
          style={{
            width: "100%",
            height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
            flexDirection: "column",
            justifyContent: "flex-start"
            // flex: 1
          }}
        >
          <ScrollView
            horizontal
            style={{
              flexDirection: "row",
              marginTop: 10,
              maxHeight: 50,
              flex: 0.1
            }}
          >
            <TouchableOpacity
              onPress={() => this._selectTab(true)}
              style={{ maxHeight: 50 }}
            >
              <Text
                style={
                  this.state.myRequestTab
                    ? styles.titleEnabled
                    : styles.titleNotEnabled
                }
              >
                My Payment Request
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ maxHeight: 50 }}
              onPress={() => this._selectTab(false)}
            >
              <Text
                style={
                  !this.state.myRequestTab
                    ? styles.titleEnabled
                    : styles.titleNotEnabled
                }
              >
                Received
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {/* <View style={{ flexDirection: "row", flex: 0.1 }}>
            <SortByButton
              style={{ marginLeft: 15, marginRight: 15 }}
              onSelect={this.setSortType}
            />
            <Text>{this.state.sortType}</Text>
          </View> */}

          <ScrollView style={{ marginVertical: 10, minHeight: 200, flex: 0.7 }}>
            {this._renderItems()}
          </ScrollView>
          <View style={{ flex: 0.2, marginHorizontal: 15 }}>
            <RoundButton
              text={"Request Money"}
              onPress={() => this.props.navigation.navigate("SendRequestMoney")}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const RequestMoneyContainer = connect(mapStateToProps)(RequestMoneyScreen);
export default RequestMoneyContainer;
const styles = {
  title: {},
  titleEnabled: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 22,
    marginLeft: 20,
    marginBottom: 20
  },
  titleNotEnabled: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 22,
    marginLeft: 20,
    marginBottom: 20,
    color: CONSTANTS.MY_GREY
  }
};
