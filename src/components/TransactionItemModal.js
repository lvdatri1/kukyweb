import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, ImageBackground, StyleSheet } from "react-native";
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";

export default class WalletInfoModal extends Component {
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    const data = this.props.data;
    const transactionId = data.blockchainId;
    const transactionTime = data.createdAt;
    const transactionComment = data.message || "no comment field yet";
    const transactionFrom = data.from || "no field yet";

    return (
      <Modal animationType="slide" transparent={true} visible={showUp}>
        <View style={{ backgroundColor: "rgba(50,50,50,0.5)", width: "100%", height: "100%" }}>
          <View
            style={{
              flexDirection: "column",
              marginHorizontal: 20,
              marginTop: 200,
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 9
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,
              elevation: 19,
              backgroundColor: "white",
              opacity: 1
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 15,
                paddingHorizontal: 20,
                marginBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: "black"
              }}
            >
              <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>Transaction details</Text>
              <TouchableOpacity onPress={() => onClose()}>
                <Icon name="md-close" />
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
              <Text style={styles.big}>Transaction ID</Text>
              <Text style={styles.small}>{transactionId}</Text>
              <Text style={styles.big}>Time</Text>
              <Text style={styles.small}>{transactionTime}</Text>
              <Text style={styles.big}>Comment</Text>
              <Text style={styles.small}>{transactionComment}</Text>
              <Text style={styles.big}>From</Text>
              <Text style={styles.small}>{transactionFrom}</Text>
            </View>
            <TouchableOpacity
              onPress={() => onClose()}
              style={{
                width: "50%",
                height: 50,
                borderRadius: 20,
                marginTop: 30,
                backgroundColor: CONSTANTS.MY_BLUE,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 10
              }}
            >
              <Text style={{ color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = {
  big: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,

    margin: 5,
    color: CONSTANTS.MY_BLUE
  },
  small: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,

    margin: 5
    // color: CONSTANTS.MY_GREY
  }
};
