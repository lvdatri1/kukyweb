import { Icon } from "native-base";
import React, { Component } from "react";
import { ImageBackground, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { searchUsers } from "../actions/peopleActions";
import CONSTANTS from "../common/PeertalConstants";
import { OverlayLoading, Text } from "../components/CoreUIComponents";
import PersonTagItem from "./PersonTagItem";

//@flow
class TagPeopleModal extends Component {
  constructor(props) {
    super(props);
    this._renderItems = this._renderItems.bind(this);
    this.state = {
      searchText: "",
      peopleList: [],
      isLoading: false
    };
    this._handleSearch = this._handleSearch.bind(this);
    this.setCheckBack = this.setCheckBack.bind(this);
    this._resetCheck = this._resetCheck.bind(this);
  }
  setCheckBack(index, checked) {
    // alert("item is" + index + checked);
    let list = [...this.state.peopleList];
    let item = { ...list[index] };
    item.checked = checked;
    list[index] = item;
    this.setState({ peopleList: list }, () => {
      //can have something after update state value;
      var selectedList = this.state.peopleList.filter(item => item.checked);
      this.props.callback(selectedList);
    });
  }
  componentDidMount() {
    this._handleSearch();
  }
  _handleSearch() {
    this.setState({ isLoading: true });
    searchUsers(
      this.props.user.accessToken,
      this.state.searchText,
      0,
      20,
      res => {
        this.setState({ peopleList: [...res.data.data.users], isLoading: false });
      },
      err => {
        alert("there was some errors " + err.message);
        this.setState({ isLoading: false });
      }
    );
  }
  _renderItems() {
    return this.state.peopleList.map((item, index) => (
      <PersonTagItem key={index} data={item} callback={this.setCheckBack} index={index} />
    ));
  }
  _resetCheck() {
    this.setState({ peopleList: this.state.peopleList.map(item => ({ ...item, checked: false })) });
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    const title = this.props.title || "TAG FRIENDS";
    const rightButton = this.props.rightButton;
    const rightCallback = this.props.rightCallback || onClose;

    return (
      <Modal animationType="slide" transparent={false} visible={showUp} onShow={this._resetCheck}>
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
            <TouchableOpacity onPress={() => onClose()}>
              <Icon name="arrowleft" type="AntDesign" />
            </TouchableOpacity>

            <Text style={{ fontSize: 14, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, color: "black" }}>{title}</Text>

            <TouchableOpacity
              onPress={() => {
                if (rightCallback) rightCallback();
              }}
              disabled={!rightButton}
              style={{ opacity: rightButton ? 1 : 0 }}
            >
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{ width: "100%", height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                margin: 10,
                borderRadius: 15,
                backgroundColor: CONSTANTS.MY_GRAYBG
              }}
            >
              <TextInput
                value={this.state.searchText}
                onChangeText={text => this.setState({ searchText: text })}
                style={{ fontSize: 14, color: "gray", alignSelf: "center", maxWidth: "80%",fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT }}
                placeholder={"Search"}
                onSubmitEditing={this._handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity onPress={this._handleSearch}>
                <Icon name="search" type="EvilIcons" style={{ marginTop: 6, marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={{ marginTop: 20, marginHorizontal: 15, fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>My Network</Text>
              {this._renderItems()}
            </ScrollView>
          </ImageBackground>
          {this.state.isLoading ? <OverlayLoading /> : null}
        </View>
      </Modal>
    );
  }
}

const MapStateToProps = store => ({ user: store.user });
const TagPeopleModalContainer = connect(MapStateToProps)(TagPeopleModal);
export default TagPeopleModalContainer;
