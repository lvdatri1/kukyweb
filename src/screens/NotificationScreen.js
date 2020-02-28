import { Icon } from "native-base";
import React, { Component } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import ActionSheet from "react-native-actionsheet";
import { connect } from "react-redux";
import { getAllNotifications, readAllNotifications, deleteAllNotifications } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import Footer from "../components/Footer";
import NotificationItem from "../components/NotificationItem";

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      notificationList: []
    };
    this._loadData = this._loadData.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
    this.onHandleAction = this.onHandleAction.bind(this);
  }
  onHandleAction(index) {
    if (index == 0) {
      // alert("del all");
      deleteAllNotifications(this.props.user.accessToken, res => {
        // alert("el", res.data);
        this._loadData();
        // console.log("delete********************", res);
      });
    }
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  _loadData() {
    this.setState({ isLoading: true, notificationList: [] });
    getAllNotifications(
      this.props.user.accessToken,
      res => {
        this.setState({
          notificationList: res.data.data.list,
          isLoading: false
        });
      },
      err => {
        alert("cannot access to system now" + err.message);
        this.setState({ isLoading: false });
      }
    );
  }

  // componentDidMount() {
  //   this._loadData();
  // }
  _keyExtractor(item, index) {
    return index.toString() + item.id.toString();
  }
  _renderItem({ item }) {
    return <NotificationItem data={item} navigation={this.props.navigation} />;
  }
  render() {
    readAllNotifications(this.props.user.accessToken, res => {
      // alert(res.data);
    });
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            this._loadData();
          }}
        />
        <View
          style={{
            flex: 50 + CONSTANTS.SPARE_HEADER,
            flexDirection: "column",
            height: 50,
            backgroundColor: "white"
          }}
        >
          {/* <StatusBar /> */}
          <View style={{ flexDirection: "row", marginTop: CONSTANTS.SPARE_HEADER }}>
            <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
              <Image
                source={{ uri: this.props.user.avatar }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  marginLeft: 10
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                height: 34,
                // backgroundColor: CONSTANTS.MY_GRAYBG,
                width: CONSTANTS.WIDTH - 30 - 34
                // borderRadius: 17
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.showActionSheet();
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  height: "100%",
                  row: "100%"
                }}
              >
                <Icon
                  name="dots-three-vertical"
                  type="Entypo"
                  style={{ marginTop: 6, marginRight: 10, fontSize: 16 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: CONSTANTS.MY_GRAYBG,
            flex: CONSTANTS.HEIGHT - 50 - 55 - CONSTANTS.SPARE_FOOTER - CONSTANTS.SPARE_HEADER
          }}
        >
          <FlatList
            onRefresh={this._loadData}
            refreshing={this.state.isLoading}
            data={this.state.notificationList}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </View>

        <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
          <Footer {...this.props} active="notification" />
        </View>
        {/* {this.state.isLoading ? <OverlayLoading /> : null} */}
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={"More actions"}
          options={["Delete all", "cancel"]}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={this.onHandleAction}
        />
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const NotificationContainer = connect(mapStateToProps)(NotificationScreen);
export default NotificationContainer;
