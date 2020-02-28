import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, ImageBackground, ScrollView, TextInput, FlatList } from "react-native";
import { Text, OverlayLoading, LoadingSpinner } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { getSearchPosts } from "../actions/postActions";
import { searchUsers } from "../actions/peopleActions";
import PostItem from "./PostItem";
import { connect } from "react-redux";
import PersonRowItem from "./PersonRowItem";

class SearchActionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoading: false,
      text: "",
      tabSelected: "people",
      posts: [],
      people: []
    };
    this._renderItem = this._renderItem.bind(this);
    this._loadData = this._loadData.bind(this);
    this._searchAction = this._searchAction.bind(this);
    this._renderTab = this._renderTab.bind(this);
  }
  _searchAction() {
    if (this.state.tabSelected == "people") {
      this.setState({ people: [], isLoading: true });
      searchUsers(this.props.user.accessToken, this.state.text, 0, 20, res => {
        this.setState({ isLoading: false, people: res.data.data.users });
      });
    }

    this.setState({ isLoading: true, posts: [] });
    getSearchPosts(
      this.props.user.accessToken,
      this.state.text,
      0,
      20,
      null,
      null,
      null,
      "TIMELINE",
      res => {
        this.setState({ posts: res.data.data.posts, isLoading: false });
      },
      err => {
        this.setState({ isLoading: false, posts: [] });
      }
    );
  }
  _loadData() {
    if (this.state.tabSelected == "people" && this.state.people.length >= 20) {
      this.setState({ isLoading: true });
      searchUsers(this.props.user.accessToken, this.state.text, 0, 20, res => {
        this.setState({ isLoading: false, people: this.state.people.concat(res.data.data.users) });
      });
    }
    this.setState({ isLoading: true });
    getSearchPosts(
      this.props.user.accessToken,
      this.state.text,
      this.state.posts.length,
      20,
      null,
      null,
      null,
      "TIMELINE",
      res => {
        this.setState({ posts: this.state.posts.concat(res.data.data.posts), isLoading: false });
      },
      err => {
        this.setState({ isLoading: false, posts: [] });
      }
    );
  }
  _keyExtractor = (item, index) => item.id + "" + index;

  componentDidMount() {
    // this._loadData();
  }
  _renderTab() {
    if (this.state.tabSelected == "people") {
      return;
    }
  }
  _renderItem = ({ item }) => {
    if (this.state.tabSelected == "people") return <PersonRowItem data={item} navigation={this.props.navigation} />;
    else return <PostItem navigation={this.props.navigation} data={item} />;
  };

  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;

    return (
      <View>
        <Modal animationType="slide" transparent={false} visible={showUp} onShow={() => {}}>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginTop: CONSTANTS.SPARE_HEADER,
                marginHorizontal: 15,
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  width: CONSTANTS.WIDTH_RATIO * 260,
                  minHeight: 34,
                  borderRadius: 17,
                  backgroundColor: CONSTANTS.MY_GRAYBG,
                  //   borderColor: "black",
                  padding: 4,
                  //   borderWidth: 1,
                  justifyContent: "center"
                }}
              >
                <TextInput
                  onSubmitEditing={() => this._searchAction()}
                  style={{ textAlign: "right", marginRight: 5, fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT }}
                  value={this.state.text}
                  placeholder="Search"
                  onChangeText={text => this.setState({ text: text })}
                  returnKeyType="search"
                />
              </View>
              <TouchableOpacity onPress={onClose} style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="qrcode" type="AntDesign" style={{ fontSize: 18, marginRight: 5 }} />
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15, marginHorizontal: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: 15
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ tabSelected: "people" });
                    this._searchAction();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                      fontSize: 22,
                      color: this.state.tabSelected !== "people" ? CONSTANTS.MY_GREY : "black"
                    }}
                  >
                    People
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ tabSelected: "conversation" }, () => this._searchAction());
                  }}
                >
                  <Text
                    style={{
                      fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                      fontSize: 22,
                      color: this.state.tabSelected !== "conversation" ? CONSTANTS.MY_GREY : "black"
                    }}
                  >
                    Conversation
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  refreshing={this.state.isLoading}
                  data={this.state.tabSelected == "conversation" ? this.state.posts : this.state.people}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                  onEndReached={this._loadData}
                />
                {this.state.isLoading ? <LoadingSpinner /> : null}
                {this.state.people.length == 0 && !this.state.isLoading ? <Text>No results</Text> : null}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = store => ({
  user: store.user
});
const SearchActionContainer = connect(mapStateToProps)(SearchActionModal);
export default SearchActionContainer;
