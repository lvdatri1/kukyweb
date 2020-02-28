import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  TextInput
} from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import RadioButton from "./CoreUIComponents/RadioButton";
import { addACard } from "../actions/userActions";

export default class LinkCreditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      cardHolderName: "",
      cardNumber: "",
      cardType: "visa",
      cardExpiryDate: null,
      cardCCV: "",
      cardBillingAddress: "",
      cardBillingCountry: ""
    };
    this._selectCardType = this._selectCardType.bind(this);
    this._handleLinkAction = this._handleLinkAction.bind(this);
  }
  _handleLinkAction() {
    const month = this.state.cardExpiryDate.substr(
      0,
      this.state.cardExpiryDate.indexOf("/")
    );
    const year = this.state.cardExpiryDate.substr(
      this.state.cardExpiryDate.indexOf("/") + 1,
      this.state.cardExpiryDate.length - 1
    );
    const cardData = {
      ...this.state,
      fullName: this.state.cardHolderName,
      cvc: this.state.cardCCV,
      expiryDate: {
        month: month,
        year: year
      }
    };
    this.setState({ isLoading: true });
    addACard(
      this.props.user.accessToken,
      cardData,
      res => {
        alert("Added successfully");
        this.setState({ isLoading: false });
      },
      err => {
        alert("Card error " + err.message);
        this.setState({ isLoading: false });
      }
    );
  }
  _selectCardType(type = "visa") {
    this.setState({ cardType: type });
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
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
                LINK A CARD
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
            <ScrollView style={{ marginHorizontal: 15 }}>
              <View style={styles.lineContainer}>
                <Icon
                  name="person"
                  type="MaterialIcons"
                  style={{ ...styles.iconStyle }}
                />
                <Text style={{ ...styles.textCaption }}>Card Holder Name</Text>
              </View>
              <View>
                <TextInput
                  style={{ ...styles.inputContainer }}
                  placeholder={"Enter card holder name"}
                  value={this.state.cardHolderName}
                  onChangeText={value =>
                    this.setState({ cardHolderName: value })
                  }
                />
              </View>
              <View style={styles.lineContainer}>
                <Icon
                  name="ios-alert"
                  type="Ionicons"
                  style={{ ...styles.iconStyle }}
                />
                <Text style={{ ...styles.textCaption }}>
                  Card Holder Number
                </Text>
              </View>
              <View>
                <TextInput
                  style={{ ...styles.inputContainer }}
                  placeholder={"Enter card number"}
                  value={this.state.cardNumber}
                  onChangeText={value => this.setState({ cardNumber: value })}
                />
              </View>
              <View style={styles.lineContainer}>
                <Icon
                  name="ios-card"
                  type="Ionicons"
                  style={{ ...styles.iconStyle }}
                />
                <Text style={{ ...styles.textCaption }}>
                  Please choose your card type:
                </Text>
              </View>
              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <RadioButton
                  selected={this.state.cardType == "visa"}
                  type={"visa"}
                  callback={() => this._selectCardType("visa")}
                />
                <RadioButton
                  selected={this.state.cardType == "mastercard"}
                  type={"mastercard"}
                  callback={() => this._selectCardType("mastercard")}
                />
                <RadioButton
                  selected={this.state.cardType == "maestro"}
                  type={"maestro"}
                  callback={() => this._selectCardType("maestro")}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <RadioButton
                  selected={this.state.cardType == "jcb"}
                  type={"jcb"}
                  callback={() => this._selectCardType("jcb")}
                />
                <RadioButton
                  selected={this.state.cardType == "american-express"}
                  type={"american-express"}
                  callback={() => this._selectCardType("american-express")}
                />
                <RadioButton
                  selected={this.state.cardType == "discover"}
                  type={"discover"}
                  callback={() => this._selectCardType("discover")}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View>
                  <View style={styles.lineHalfContainer}>
                    <Icon
                      name="ios-calendar"
                      type="Ionicons"
                      style={{ ...styles.iconStyle }}
                    />
                    <Text style={{ ...styles.textCaption }}>Expiry Date</Text>
                  </View>
                  <View>
                    <TextInput
                      style={{ ...styles.inputContainer }}
                      placeholder={"(MM/YY)"}
                      value={this.state.cardExpiryDate}
                      onChangeText={value =>
                        this.setState({ cardExpiryDate: value })
                      }
                    />
                  </View>
                </View>
                <View>
                  <View style={styles.lineHalfContainer}>
                    <Icon
                      name="md-lock"
                      type="Ionicons"
                      style={{ ...styles.iconStyle }}
                    />
                    <Text style={{ ...styles.textCaption }}>CCV Number</Text>
                  </View>
                  <View>
                    <TextInput
                      style={{ ...styles.inputContainer }}
                      placeholder={"Enter CCV Number"}
                      value={this.state.cardCCV}
                      onChangeText={value => this.setState({ cardCCV: value })}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.lineContainer}>
                <Icon
                  name="md-home"
                  type="Ionicons"
                  style={{ ...styles.iconStyle }}
                />
                <Text style={{ ...styles.textCaption }}>Billing Address</Text>
              </View>
              <View>
                <TextInput
                  style={{ ...styles.inputContainer }}
                  placeholder={"Enter billing address"}
                  value={this.state.cardBillingAddress}
                  onChangeText={value =>
                    this.setState({ cardBillingAddress: value })
                  }
                />
              </View>
              {this.state.isLoading ? null : (
                <TouchableOpacity
                  onPress={this._handleLinkAction}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 25,
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
                    LINK CARD
                  </Text>
                </TouchableOpacity>
              )}

              <View style={{ width: "100%", height: 300 }} />
            </ScrollView>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}

const styles = {
  lineContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 20
  },
  textCaption: {
    marginLeft: 10
  },
  inputContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: CONSTANTS.MY_GREY,
    borderRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  iconStyle: {
    fontSize: 18
  },
  lineHalfContainer: {
    flexDirection: "row",
    width: 160 * CONSTANTS.WIDTH_RATIO,
    justifyContent: "flex-start",
    marginTop: 20
  },
  buttonContainer: {
    flexDirection: "row"
  },
  image: { height: 12, width: 42 }
};
