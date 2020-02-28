import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { connect } from "react-redux";
import BankAccountItem from "../components/BankAccountItem";
import { getBankAccounts } from "../actions/userActions";

class CashOutStep1Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankAccounts: []
    };
    this._initData = this._initData.bind(this);
  }
  _renderCards() {
    const data = this.state.bankAccounts || [];
    // for (let i = 0; i < 4; i++) {
    //   data.push(i);
    // }
    return data.map((item, index) => (
      <BankAccountItem data={item} key={index} />
    ));
  }
  _initData() {
    alert("good");
    getBankAccounts(this.props.user.accessToken, res => {
      this.setState({ bankAccounts: res.data.data.list });
    });
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;

    const description = "We keep your financial details more secure";

    const title = "Please use Bank Account to cash out";

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showUp}
        onShow={this._initData}
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
              onPress={() => this.props.navigation.navigate("LinkNewBank")}
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
                Link Other Bank Account
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}

const MapStateToProps = store => ({ user: store.user });
export default (CashOutStep1ModalContainer = connect(MapStateToProps)(
  CashOutStep1Modal
));
