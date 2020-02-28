import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";

/*images*/
const logoSource = require("../assets/static-pages/logo.png");

class SplashScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate("Home");
    }, 2000);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={{ flex: 1, width: 100, height: 100, resizeMode: "contain" }} source={logoSource} />
        </View>
      </View>
    );
  }
}
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  logoContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  appNameContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
