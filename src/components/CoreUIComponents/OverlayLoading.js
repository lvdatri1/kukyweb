import React, { Component } from "react";
import { ActivityIndicator, View, Image } from "react-native";

export default class MyOverlayLoading extends Component {
  render() {
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.8,
          backgroundColor: "white"
        }}
      >
        {/* <ActivityIndicator size='large' /> */}
        <Image
          source={require("../../assets/icon/apploading.gif")}
          style={{
            width: 256,
            height: 256,
            backgroundColor: "white",
            opacity: 0.8
          }}
        />
      </View>
    );
  }
}
