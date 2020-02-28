import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from "react-native";
import { Icon } from "native-base";
import CONSTANTS from "../common/PeertalConstants";
import { loginViaEmailOrSMS, getDeviceFirebaseToken } from "../actions/userActions";
import { connect } from "react-redux";
import { OverlayLoading, Text } from "../components/CoreUIComponents";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourEmail: "",
      isLoading: false
    };
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  onLoginSubmit() {
    if (this.state.isLoading) return;
    //request get access Token of firebase
    getDeviceFirebaseToken(token => {
      // alert(token);
      this.props.dispatch({
        type: "GET_DEVICE_TOKEN",
        data: {
          deviceFirebaseToken: token
        }
      });
      this.setState({ ...this.state, isLoading: true });
      loginViaEmailOrSMS(
        this.state.yourEmail,
        "email",
        token,
        res => {
          this.setState({ ...this.state, isLoading: false });
          // console.log("email is correct", res.data);
          let response = res.data;
          if (response.data.account_type === "existed")
            this.props.navigation.navigate("ActivationCode", {
              loginId: this.state.yourEmail
            });
          else
            this.props.navigation.navigate("FirstTimeUser", {
              loginId: this.state.yourEmail,
              type: "email"
            });
        },
        err => {
          alert(err);
          this.setState({ ...this.state, isLoading: false });
        }
      );
    });
  }
  componentDidMount() {
    // this.props.navigation.set;
  }
  render() {
    return (
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
            <Text style={{ fontSize: 22, fontFamily: "Montserrat-Light" }}>PROVIDE US YOUR</Text>
            <Text style={{ fontSize: 36, fontFamily: "Montserrat-SemiBold" }}>Email</Text>
          </View>
          <View
            style={{
              maxWidth: CONSTANTS.WIDTH - 100,
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ textAlign: "center" }}>
              We will send a code that you can start contributing to the community
            </Text>
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
              <Icon name={"mail"} style={{ fontSize: 22, marginRight: 6, marginLeft: 2 }} />
              <Text style={{ fontSize: 14, alignSelf: "center" }}>Your Email</Text>
            </View>
            <View
              style={{
                marginLeft: 15,
                marginRight: 15,
                borderColor: "gray",
                borderWidth: 1,
                alignItems: "flex-start",
                borderRadius: 5
              }}
            >
              <TextInput
                onSubmitEditing={this.onLoginSubmit}
                returnKeyType="done"
                placeholder="enter your email"
                textContentType={"emailAddress"}
                style={{
                  fontSize: 14,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  width: CONSTANTS.WIDTH - 20,

                  // width: CONSTANTS.WIDTH - 30
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
                }}
                onChangeText={text => this.setState({ ...this.state, yourEmail: text })}
                value={this.state.yourEmail}
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
                onPress={this.onLoginSubmit}
                style={{
                  flex: 1,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  borderRadius: 20,
                  justifyContent: "center",
                  flexDirection: "row",
                  maxWidth: "100%",
                  padding: 10,
                  margin: 10
                }}
              >
                {/* <Icon
                  name={"mail"}
                  style={{
                    color: "white",
                    fontSize: 22,
                    marginRight: 6,
                    marginLeft: 2
                  }}
                /> */}
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    alignSelf: "center",
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
                  }}
                >
                  Send me code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.state.isLoading ? <OverlayLoading /> : null}
      </ImageBackground>
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
