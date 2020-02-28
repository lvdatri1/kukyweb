import React, { Component } from "react";
import { ImageBackground, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import CONSTANTS from "../common/PeertalConstants";
import { RoundButton, Text } from "../components/CoreUIComponents";
import SuccessMessageObject from "../models/SuccessMessageObject";

export default class SuccessActionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._loadingData = this._loadingData.bind(this);
  }
  _loadingData() {
    const data = this.props.navigation.getParam(
      "data",
      new SuccessMessageObject()
    );
    this.setState({ ...data });
  }
  render() {
    const data = this.state;
    const title = data.title;
    const headline = data.headline;
    const firstLine = data.firstLine;
    const mainNumber = data.mainNumber;
    const mainCurrency = data.mainCurrency;
    const secondLine = data.secondLine;
    const message = data.message;
    return (
      <View style={{ flexDirection: "column", height: "100%" }}>
        <NavigationEvents
          onWillFocus={() => {
            this._loadingData();
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
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
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
              {title}
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
          <Text style={styles.title}>{headline}</Text>
          <Text style={styles.normal}>{firstLine}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <Text style={styles.mainCurrency}>{mainCurrency}</Text>
            <Text style={styles.mainNumber}>{mainNumber}</Text>
          </View>
          <Text style={styles.normal}>{secondLine}</Text>
          <View style={styles.blackLine} />

          <Text style={styles.normal}>{message}</Text>
          <RoundButton
            text="Done"
            style={{ width: "40%", marginTop: 20 }}
            onPress={() => this.props.navigation.navigate("MainFlow")}
          />
        </ImageBackground>
      </View>
    );
  }
}

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
  blackLine: {
    width: "30%",
    marginVertical: 20,
    borderBottomColor: CONSTANTS.MY_GREY,
    borderBottomWidth: 1
  },
  mainNumber: {
    fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE + 10,
    color: CONSTANTS.MY_BLUE
  },
  mainCurrency: {
    marginHorizontal: 10,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10
  },
  normal: {
    marginVertical: 10,
    fontSize: 14,
    maxWidth: "80%"
  },
  title: {
    fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    // color: CONSTANTS.MY_BLUE,
    marginTop: 50
  }
};
