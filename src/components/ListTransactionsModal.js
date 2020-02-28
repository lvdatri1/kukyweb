import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl } from "react-native";
import { Text, OverlayLoading, LoadingSpinner } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import TransactionItem from "../components/TransactionItems";
import { getWalletTransactions } from "../actions/userActions";

export default class ListTransactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoading: false
    };
    this._renderItems = this._renderItems.bind(this);
    this._loadData = this._loadData.bind(this);
  }
  _loadData(type = "all") {
    this.setState({ isLoading: true, transactions: [] });
    getWalletTransactions(
      this.props.user.accessToken,
      type,
      res => {
        this.setState(preState => ({ ...preState, transactions: res.data.data.list.reverse(), isLoading: false }));
      },
      err => {
        this.setState({
          isLoading: false
        });
        alert("Something is not right" + err.message);
      }
    );
  }
  componentDidMount() {
    // this._loadData();
  }
  _renderItems() {
    return this.state.transactions.map((item, index) => (
      <TransactionItem
        key={index}
        data={item}
        exchangeRate={this.props.data.exchangeRate || 100}
        currency={this.props.data.currency || "USD"}
      />
    ));
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    const data = this.props.data;
    const exchangeRate = data.exchangeRate || 100;
    const dollarNumber = (data.balance * exchangeRate).toFixed(2) || "0.00";
    const currency = data.currency || "USD";

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={showUp}
          onShow={() => {
            this._loadData();
          }}
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
                <Text
                  style={{ marginTop: 25, marginLeft: 25, marginTop: 25, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}
                >
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
              <ScrollView
                style={{}}
                refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this._loadData} />}
              >
                {this._renderItems()}
                {/* {this.state.isLoading ? <LoadingSpinner /> : null} */}
              </ScrollView>
            </ImageBackground>
          </View>
        </Modal>
      </View>
    );
  }
}
