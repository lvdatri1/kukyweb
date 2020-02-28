import { Icon } from "native-base";
import React, { Component } from "react";
import { ImageBackground, StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { loginCodeInput } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import { OverlayLoading, Text } from "../components/CoreUIComponents";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtCode: "",
      isLoading: false,
      loginId: this.props.navigation.getParam("loginId")
    };
    this.onJoinSubmit = this.onJoinSubmit.bind(this);
  }

  onJoinSubmit() {
    if (this.state.isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    loginCodeInput(
      this.state.loginId,
      this.state.txtCode,
      res => {
        let response = res.data;
        console.log("token is: " + response.data.user_data.token);
        console.log(response);
        this.setState({ isLoading: false });
        if (response.status === 200) {
          this.props.dispatch({
            type: "USER_RECEIVE_LOG_IN_SUCCESSFULLY",
            data: {
              user_data: response.data.user_data,
              accessToken: response.data.user_data.token,
              settings: response.data.settings
            }
          });
          this.props.dispatch({
            type: "LOGGED_MENU"
          });
          this.props.navigation.navigate("MainFlow");
          console.log("MainFlow");
        } else {
          alert(response.message);
        }
      },
      err => {
        // alert(err);
        this.console.log(err);
        this.setState({ isLoading: false });
      }
    );
  }

  componentDidMount() {}

  render() {
    return (
      <ScrollView>
        <ImageBackground
          source={require("../assets/xd/background/Login-bg.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrowleft" type="AntDesign" style={{ marginTop: CONSTANTS.SPARE_HEADER, marginLeft: 15 }} />
            </TouchableOpacity>
            <View
              style={{
                marginTop: (120 / 812) * CONSTANTS.HEIGHT,
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 36, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>Activation Code</Text>
              <Text style={{ fontSize: 22, fontFamily: CONSTANTS.MY_FONT_FAMILY_LIGHT }}>WAS SENT TO YOUR MOBILE</Text>
            </View>
            <View
              style={{
                maxWidth: CONSTANTS.WIDTH - 100,
                alignSelf: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ textAlign: "center" }}>Enter the code below</Text>
            </View>
            <View style={{}}>
              <View
                style={{
                  paddingLeft: 15,
                  alignItems: "center",
                  marginTop: 30,
                  flexDirection: "row"
                }}
              >
                <Icon name={"lock"} style={{ fontSize: 22, marginRight: 6, marginLeft: 2 }} />
                <Text style={{ fontSize: 14, alignSelf: "center" }}>Security Code</Text>
              </View>
              <View
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 10,
                  borderColor: "gray",
                  borderWidth: 1,
                  alignItems: "flex-start",
                  borderRadius: 5
                }}
              >
                <TextInput
                  onSubmitEditing={this.onJoinSubmit}
                  returnKeyType="done"
                  textContentType={"oneTimeCode"}
                  keyboardType={"number-pad"}
                  placeholder="security code"
                  style={{
                    fontSize: 14,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    width: CONSTANTS.WIDTH - 20,

                    // width: CONSTANTS.WIDTH - 30
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
                  }}
                  onChangeText={text => this.setState({ ...this.state, txtCode: text })}
                  value={this.state.txtCode}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  disabled={this.state.isLoading}
                  onPress={this.onJoinSubmit}
                  style={{
                    flex: 1,
                    backgroundColor: CONSTANTS.MY_BLUE,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    maxWidth: "100%",
                    padding: 10,
                    margin: 10
                  }}
                >
                  <Icon
                    name={"lock"}
                    style={{
                      color: "white",
                      fontSize: 22,
                      marginRight: 6,
                      marginLeft: 2
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      alignSelf: "center",
                      fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
                    }}
                  >
                    Verify
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this.state.isLoading ? <OverlayLoading /> : null}
        </ImageBackground>
      </ScrollView>
    );
  }
}

const MapStateToProps = store => ({ user: store.user });
const LoginContainer = connect(MapStateToProps)(LoginScreen);
export default LoginContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 4
  },
  mainButtons: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  footerButtons: {
    flex: 4,
    justifyContent: "space-between"
  },
  siginText: {
    marginTop: "50%",
    fontSize: 45,
    alignSelf: "center",
    // fontWeight: 'bold',
    fontFamily: "SF Pro Display"
  },
  discoverText: {
    fontSize: 25,
    alignSelf: "center",
    fontFamily: "HelveticaNeue-Light",
    fontWeight: "200"
  },
  button: {},
  socialButton: {
    backgroundColor: "red",
    flex: 1,
    textAlign: "center",
    color: "white"
  },
  txtButton: {}
});
