import React, { Component } from "react";
import { Image, TouchableOpacity, View, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { Text } from "./CoreUIComponents";
import { Icon } from "native-base";
import CONSTANTS from "../common/PeertalConstants";
import SendMoneyModal from "./SendMoneyModal";

//@flow
export default class ReportReward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportModal: false,
      sendMoneyModal: false
    };
    this._renderItems = this._renderItems.bind(this);
    this._touchItem = this._touchItem.bind(this);
    this._handleReport = this._handleReport.bind(this);
  }
  _handleReport() {}
  _touchItem(name, id) {
    if (name == "reward") this.setState({ sendMoneyModal: true, reportModal: false });
    if (name == "report") {
      alert("report");
      // this.setState({ reportModal: false });
      // Alert.alert("Report", "Do you want to report this post?", [{ text: "OK" }, { text: "Cancel" }]);
    }
    // alert("click on item" + name + id);
    // const backAction = this.props.callback;
    // backAction();
  }
  _renderItems() {
    const data = [
      { iconType: "FontAwesome5", iconName: "money-bill", name: "reward" },
      { iconType: "Foundation", iconName: "alert", name: "report" }
    ];
    return data.map((item, index) => (
      <TouchableOpacity
        onPress={() => {
          this._touchItem(item.name, index);
          this.setState({ reportModal: false });
        }}
        style={{
          flexDirection: "row",
          height: 60,
          paddingLeft: 20,
          alignItems: "center",
          borderBottomColor: CONSTANTS.MY_GREY,
          borderBottomWidth: 1
        }}
        key={index}
      >
        <Icon name={item.iconName} type={item.iconType} style={{ fontSize: 16, marginRight: 10 }} />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    ));
  }
  render() {
    const getStyle = this.props.style;
    const params = this.props.params;
    return (
      <View style={{ ...getStyle }}>
        <TouchableOpacity
          onPress={() => this.setState({ reportModal: true })}
          //   style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Icon
            name="dots-three-vertical"
            type="Entypo"
            style={{
              fontSize: 16,
              fontWeight: "200",
              marginRight: 10,
              marginTop: 10
            }}
          />
        </TouchableOpacity>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.reportModal}
          onDismiss={() => this.setState({ reportModal: false })}
          onRequestClose={() => this.setState({ reportModal: false })}
        >
          <TouchableWithoutFeedback onPress={() => this.setState({ reportModal: false })}>
            <View style={{ width: "100%", height: "100%", backgroundColor: "grey", opacity: 0.2 }} />
          </TouchableWithoutFeedback>
          <View
            style={{
              bottom: 0,
              left: 0,
              position: "absolute",
              // backgroundColor: "white",
              width: "100%",
              minHeight: 120
            }}
          >
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ reportModal: false })}>
              <View style={{ width: 50, height: 5, backgroundColor: CONSTANTS.MY_GREY, marginBottom: 15 }} />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "white",
                height: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                ...CONSTANTS.MY_SHADOW_STYLE
              }}
            >
              {this._renderItems()}
            </View>
          </View>
        </Modal>
        <SendMoneyModal
          enabled={this.state.sendMoneyModal}
          onClose={() => this.setState({ sendMoneyModal: false })}
          params={params}
        />
      </View>
    );
  }
}
