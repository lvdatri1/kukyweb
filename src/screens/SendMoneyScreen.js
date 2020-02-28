import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import {
  Text,
  Avatar,
  RoundButton,
  OverlayLoading
} from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import UserObject from "../models/UserObject";
import { ScrollView } from "react-native-gesture-handler";
import TagPeopleModal from "../components/TagPeopleModal";
import { sendMoney, getWalletDetails } from "../actions/userActions";
import SuccessMessageObject from "../models/SuccessMessageObject";

// @format
// @flow

class SendMoneyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      friendName: "",
      description: "",
      amountDollar: "",
      tagPeopleModal: false,
      tagList: [],
      coinValue: "",
      isLoading: false
    };
    this._setStep = this._setStep.bind(this);
    this._renderStep1 = this._renderStep1.bind(this);
    this._renderStep2 = this._renderStep2.bind(this);
    this._renderStep3 = this._renderStep3.bind(this);
    this.updateTagList = this.updateTagList.bind(this);
    this.handleSendMoney = this.handleSendMoney.bind(this);
    this._initData = this._initData.bind(this);
  }
  _setStep(value) {
    this.setState({ currentStep: value });
  }
  updateTagList(list) {
    console.log("list updated here", list);
    this.setState({
      tagList: list
    });
  }
  handleSendMoney() {
    const data = this.state.wallet;
    const exchangeRate = data.exchangeRate || 100;
    let tags = this.state.tagList.map(item => item.id);
    let amount = (this.state.amountDollar / exchangeRate).toFixed(5);
    let reason = this.state.description;
    if (tags.length == 0) {
      return alert("need to have more than one receiver");
    }
    this.setState({ isLoading: true });
    sendMoney(
      this.props.user.accessToken,
      amount,
      tags,
      reason,
      res => {
        this.setState({
          amountDollar: "0",
          tagPeopleModal: false,
          tagList: [],
          coinValue: "0",
          isLoading: false
        });
        // onClose();
        const messageSuccess = new SuccessMessageObject(
          "Success",
          undefined,
          "",
          "",
          "",
          "",
          "Money has been sent successfully"
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
  _renderStep1() {
    return (
      <View style={{ marginLeft: 20, marginRight: 15 }}>
        <Text style={{ marginTop: 40, color: CONSTANTS.MY_BLUE }}>Step 1</Text>
        <Text
          style={{
            marginTop: 0,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: CONSTANTS.MY_BLUE,
            fontSize: 22
          }}
        >
          Recipient Info
        </Text>
        <View
          style={{
            width: "100%",
            borderBottomColor: CONSTANTS.MY_GREY,
            borderBottomWidth: 1,
            height: 20
          }}
        />
        <ScrollView
          horizontal
          style={{ flexDirection: "row", alignContent: "center" }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ tagPeopleModal: true })}
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
              borderColor: CONSTANTS.MY_BLUE,
              borderWidth: 1,
              backgroundColor: "white",
              width: 50,
              height: 50,
              borderRadius: 25
            }}
          >
            <Icon
              name="plus"
              type="AntDesign"
              style={{ fontSize: 15, color: CONSTANTS.MY_BLUE }}
            />
          </TouchableOpacity>
          {this.state.tagList.map((item, index) => (
            <Avatar
              source={{ uri: item.avatarUrl }}
              text={item.fullName}
              key={index}
            />
          ))}
        </ScrollView>
        <View
          style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
        >
          <Icon style={{ fontSize: 20 }} name="md-person" type="Ionicons" />
          <Text style={{ marginLeft: 10 }}>Recipient</Text>
        </View>
        <TextInput
          style={{ ...styles.textInput }}
          value={this.state.friendName}
          onChangeText={text => this.setState({ friendName: text })}
          placeholder="Friend name"
        />
        <View
          style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
        >
          <Icon
            style={{ fontSize: 20 }}
            name="file-invoice"
            type="FontAwesome5"
          />
          <Text style={{ marginLeft: 10 }}>Payment Info</Text>
        </View>
        <TextInput
          style={{
            ...styles.textInput,
            height: 90,
            textAlignVertical: "top"
          }}
          multiline
          value={this.state.description}
          onChangeText={text => this.setState({ description: text })}
          placeholder="message"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 20,
            marginTop: 20,
            width: "100%"
          }}
        >
          <RoundButton
            text="Cancel"
            type="gray"
            style={{ width: 100 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <RoundButton
            text="Next"
            style={{ width: 100, marginLeft: 20 }}
            onPress={() => this.setState({ currentStep: 2 })}
          />
        </View>
      </View>
    );
  }
  _renderStep2() {
    const data = this.state.wallet;
    const exchangeRate = data.exchangeRate || 100;
    const coinValue = (this.state.amountDollar / exchangeRate).toFixed(5) + "";
    const fee = "0.00"; //(this.state.amountDollar * 0.03).toFixed(2) + "";
    const currency = data.currency || "USD";
    return (
      <View style={{ marginLeft: 20, marginRight: 15 }}>
        <Text style={{ marginTop: 40, color: CONSTANTS.MY_BLUE }}>Step 2</Text>
        <Text
          style={{
            marginTop: 0,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: CONSTANTS.MY_BLUE,
            fontSize: 22
          }}
        >
          Amount
        </Text>
        <View
          style={{
            width: "100%",
            borderBottomColor: CONSTANTS.MY_GREY,
            borderBottomWidth: 1,
            height: 20
          }}
        />

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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 20,
            marginTop: 20,
            width: "100%"
          }}
        >
          <RoundButton
            text="Cancel"
            type="gray"
            style={{ width: 100 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <RoundButton
            text="Next"
            style={{ width: 100, marginLeft: 20 }}
            onPress={() => this.setState({ currentStep: 3 })}
          />
        </View>
      </View>
    );
  }
  _renderStep3() {
    const data = this.state.wallet;
    const listUsers = CONSTANTS.renderListPeople(
      this.state.tagList.map(item => item.fullName)
    );
    const amount = this.state.amountDollar;
    const fee = "$" + (amount * 0.03).toFixed(2);
    const currency = data.currency || "USD";
    const amountText = "$" + amount + " " + currency;
    return (
      <View style={{ marginLeft: 20, marginRight: 15 }}>
        <Text style={{ marginTop: 40, color: CONSTANTS.MY_BLUE }}>Step 3</Text>
        <Text
          style={{
            marginTop: 0,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: CONSTANTS.MY_BLUE,
            fontSize: 22
          }}
        >
          Finish
        </Text>
        <View
          style={{
            width: "100%",
            borderTopColor: CONSTANTS.MY_GREY,
            borderTopWidth: 2,
            marginTop: 20,
            padding: 15,
            backgroundColor: "white",
            ...CONSTANTS.MY_SHADOW_STYLE
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
              alignItems: "center",
              // justifyContent: "center",
              // marginHorizontal: 15,
              marginBottom: 15,
              borderBottomColor: CONSTANTS.MY_GREY,
              borderBottomWidth: 1
            }}
          >
            <Avatar noName={true} />
            <View style={{ marginLeft: 10 }}>
              <Text>Send to</Text>
              <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
                {listUsers}
              </Text>
            </View>
          </View>
          <Text style={styles.blueTitle}>Amount</Text>
          <Text style={{ fontSize: 18 }}>{amountText}</Text>
          <Text style={styles.blueTitle}>Fee</Text>
          <Text style={{ fontSize: 18 }}>{fee}</Text>
          <Text style={styles.blueTitle}>Payment Request Info</Text>
          <Text style={{ maxHeight: 100, minHeight: 40, marginVertical: 15 }}>
            {this.state.description}
          </Text>

          <RoundButton
            text="Send Money"
            type="blue"
            style={{ width: 250 * CONSTANTS.WIDTH_RATIO }}
            onPress={this.handleSendMoney}
          />
        </View>
      </View>
    );
  }
  _initData() {
    const tagList = this.props.navigation.getParam("tagList", []);
    this.setState({ tagList: tagList });
    getWalletDetails(
      this.props.user.accessToken,
      res => {
        this.setState({ wallet: res.data.data });
      },
      err => {
        alert("Cannot get your wallet details. Please try again later");
      }
    );
  }
  render() {
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
                SEND MONEY
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{
              width: "100%",
              height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
              flexDirection: "row"
            }}
          >
            <View style={{ width: 40, height: "100%" }}>
              <TouchableOpacity
                onPress={() => this._setStep(1)}
                style={
                  this.state.currentStep == 1
                    ? styles.step
                    : styles.stepNoActive
                }
              >
                <Text
                  style={
                    this.state.currentStep == 1
                      ? styles.stepText
                      : styles.stepNoActiveText
                  }
                >
                  1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._setStep(2)}
                style={
                  this.state.currentStep == 2
                    ? styles.step
                    : styles.stepNoActive
                }
              >
                <Text
                  style={
                    this.state.currentStep == 2
                      ? styles.stepText
                      : styles.stepNoActiveText
                  }
                >
                  2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._setStep(3)}
                style={
                  this.state.currentStep == 3
                    ? styles.step
                    : styles.stepNoActive
                }
              >
                <Text
                  style={
                    this.state.currentStep == 3
                      ? styles.stepText
                      : styles.stepNoActiveText
                  }
                >
                  3
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: CONSTANTS.WIDTH - 40, height: "100%" }}>
              {this.state.currentStep == 1
                ? this._renderStep1()
                : this.state.currentStep == 2
                ? this._renderStep2()
                : this._renderStep3()}
            </View>
          </ImageBackground>
          {this.state.isLoading ? <OverlayLoading /> : null}
        </View>
        <TagPeopleModal
          enabled={this.state.tagPeopleModal}
          onClose={() => this.setState({ tagPeopleModal: false })}
          callback={this.updateTagList}
        />
      </View>
    );
  }
}
const MapStateToProps = store => ({ user: store.user });
export default (SendMoneyContainer = connect(MapStateToProps)(SendMoneyModal));
const styles = {
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
    marginTop: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  dollarInput: {
    // padding: 5,
    width: "50%",
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
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10
  }
};
