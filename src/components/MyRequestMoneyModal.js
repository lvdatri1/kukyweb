import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView
} from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import RequestMoneyItem from "../components/RequestMoneyItem";
import SortByButton from "./CoreUIComponents/SortByButton";
import { getMoneyRequest } from "../actions/userActions";

export default class ListTransactionModal extends Component {
  constructor(props) {
    super(props);
    this._renderItems = this._renderItems.bind(this);
    this.state = {
      myRequestTab: true,
      sortType: "all"
    };
    this._selectTab = this._selectTab.bind(this);
    this.setSortType = this.setSortType.bind(this);
    this._loadData = this._loadData.bind(this);
  }
  _loadData() {}
  setSortType(type) {
    this.setState({ sortType: type });
  }
  _selectTab(value) {
    this.setState({ myRequestTab: value });
  }
  _renderItems() {
    var data = [];
    for (let i = 1; i < 20; i++) data.push(i);
    return data.map((item, index) => (
      <RequestMoneyItem key={index} data={item} />
    ));
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showUp}
        onShow={this._loadData}
      >
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
              height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
            }}
          >
            <ScrollView
              horizontal
              style={{ flexDirection: "row", marginTop: 10 }}
            >
              <TouchableOpacity onPress={() => this._selectTab(true)}>
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
              <TouchableOpacity onPress={() => this._selectTab(false)}>
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
            <View style={{ flexDirection: "row" }}>
              <SortByButton
                style={{ marginLeft: 15, marginRight: 15 }}
                onSelect={this.setSortType}
              />
              <Text>{this.state.sortType}</Text>
            </View>

            <ScrollView style={{}}>{this._renderItems()}</ScrollView>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}

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
