import { Icon } from "native-base";
import React, { Component } from "react";
import { ImageBackground, ScrollView, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { connect } from "react-redux";
import CONSTANTS from "../common/PeertalConstants";
import { Text } from "../components/CoreUIComponents";
import BankAccountObject from "../models/BankAccountObject";
import { addABank } from "../actions/userActions";

class LinkNewBankScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
      // ...new BankAccountObject()
    };

    this._handleLinkAction = this._handleLinkAction.bind(this);
  }
  _handleLinkAction() {
    addABank(this.props.user.accessToken, { ...this.state }, res => {
      Alert.alert("Success", "Bank details are now stored securely. You can take advantage of our cash out feature.");
      this.props.navigation.goBack();
    });
  }

  render() {
    return (
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
            justifyContent: "space-between",
            flexDirection: "row",
            marginHorizontal: 15
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrowleft" type="AntDesign" />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 0,

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
              LINK A BANK ACCOUNT
            </Text>
          </View>
          <TouchableOpacity onPress={this._handleLinkAction}>
            <Text style={{ fontSize: 12, color: CONSTANTS.MY_BLUE }}>Done</Text>
          </TouchableOpacity>
        </View>
        <ImageBackground
          source={require("../assets/xd/background/Login-bg.png")}
          style={{
            width: "100%",
            height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
          }}
        >
          <ScrollView style={{ marginHorizontal: 15 }}>
            <Text style={{ marginTop: 20 }}>
              The safety and security of your bank account information is protected by Kuky. You can only link a bank
              account in the currency of your country
            </Text>
            <View style={styles.lineContainer}>
              <Icon name="bank" type="MaterialCommunityIcons" style={{ ...styles.iconStyle }} />
              <Text style={{ ...styles.textCaption }}>Bank Name</Text>
            </View>
            <View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter bank's name"}
                value={this.state.bankName}
                onChangeText={value => this.setState({ bankName: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="bank" type="MaterialCommunityIcons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Bank Address</Text>
              </View>

              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter bank's name"}
                value={this.state.bankAddress}
                onChangeText={value => this.setState({ bankAddress: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="bank" type="MaterialCommunityIcons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Bank City</Text>
              </View>

              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter bank's city"}
                value={this.state.bankCity}
                onChangeText={value => this.setState({ bankCity: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="bank" type="MaterialCommunityIcons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Bank Region</Text>
              </View>

              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter bank's region"}
                value={this.state.bankRegion}
                onChangeText={value => this.setState({ bankRegion: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="bank" type="MaterialCommunityIcons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Bank zip code</Text>
              </View>

              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter bank's zip code"}
                value={this.state.bankZipCode}
                onChangeText={value => this.setState({ bankZipCode: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="bank" type="MaterialCommunityIcons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Bank Country</Text>
              </View>

              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter bank's country"}
                value={this.state.bankCountry}
                onChangeText={value => this.setState({ bankCountry: value })}
              />
            </View>
            <View style={styles.lineContainer}>
              <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
              <Text style={{ ...styles.textCaption }}>SWIFT Code</Text>
            </View>
            <View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter SWIFT code"}
                value={this.state.swiftCode}
                onChangeText={value => this.setState({ swiftCode: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account Name</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account name"}
                value={this.state.accountName}
                onChangeText={value => this.setState({ accountName: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account Number</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account number"}
                value={this.state.accountNumber}
                onChangeText={value => this.setState({ accountNumber: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account Address</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account address"}
                value={this.state.accountAddress}
                onChangeText={value => this.setState({ accountAddress: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account City</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account city"}
                value={this.state.accountCity}
                onChangeText={value => this.setState({ accountCity: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account Region</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account region"}
                value={this.state.accountRegion}
                onChangeText={value => this.setState({ accountRegion: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account zip code</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account zip code"}
                value={this.state.accountZipCode}
                onChangeText={value => this.setState({ accountZipCode: value })}
              />
            </View>
            <View>
              <View style={styles.lineContainer}>
                <Icon name="ios-alert" type="Ionicons" style={{ ...styles.iconStyle }} />
                <Text style={{ ...styles.textCaption }}>Account Country</Text>
              </View>
              <TextInput
                style={{ ...styles.inputContainer }}
                placeholder={"Enter account country"}
                value={this.state.accountCountry}
                onChangeText={value => this.setState({ accountCountry: value })}
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
                  LINK BANK ACCOUNT
                </Text>
              </TouchableOpacity>
            )}

            <View style={{ width: "100%", height: 300 }} />
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
const mapStateToProps = store => ({
  user: store.user
});
const LinkNewBankContainer = connect(mapStateToProps)(LinkNewBankScreen);
export default LinkNewBankContainer;
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
