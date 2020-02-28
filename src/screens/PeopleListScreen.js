import React, { Component } from "react";
import { FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";

import { getCurrentLocation } from "../actions/commonActions";
import { getListOfFriends, getListOfSuggestedFriends } from "../actions/peopleActions";
import { requestToReceivePushPermission } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import { LoadingSpinner } from "../components/CoreUIComponents";
import PeopleHeader from "../components/PeopleHeader";
import Footer from "../components/Footer";
import PersonRowItem from "../components/PersonRowItem";
import RoundButton from "../components/CoreUIComponents/RoundButton";

import SearchBar from "../components/SearchBar";

class PeopleListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isSearch: false, filterType: "friend", people: [], isLoading: false };
    this.handleSearchTouch = this.handleSearchTouch.bind(this);
    this._generateKey = this._generateKey.bind(this);
    this._refreshData = this._refreshData.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderFilterHeader = this._renderFilterHeader.bind(this);
    this._loadingData = this._loadingData.bind(this);
  }
  _loadingData() {
    this._refreshData();
  }
  _refreshData(tab) {
    var curTab = tab ? tab : this.state.filterType;
    this.setState({ isLoading: true, people: [], filterType: curTab });
    if (curTab == "friend") {
      getListOfFriends(
        this.props.user.accessToken,
        this.props.user.userId,
        curTab,
        0,
        20,
        res => {
          console.log("data is here", res);
          if (curTab === this.state.filterType) this.setState({ people: res.data.data, isLoading: false });
          else this.setState({ isLoading: false });
        },
        err => {
          this.setState({ isLoading: false });
          CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
        }
      );
    } else {
      getListOfSuggestedFriends(
        this.props.user.accessToken,
        this.props.user.userId,
        this.props.user.longitude,
        this.props.user.latitude,
        this.props.user.filterFriends,
        0,
        20,
        res => {
          console.log("data is here", res);
          if (curTab === this.state.filterType) this.setState({ people: res.data.data, isLoading: false });
          else this.setState({ isLoading: false });
        },
        err => {
          this.setState({ isLoading: false });
          CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
        }
      );
    }
  }
  _renderFilterHeader() {
    const headerPhoto = require("../assets/xd/background/people_suggested_header.png");
    let title1 = "Here you go!";
    let title2 = "There are best ones that match your interests.";
    return (
      <ImageBackground
        source={headerPhoto}
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: 180
        }}
      >
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}
        >
          {title1}
        </Text>
        <Text style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL
        }}>{title2}</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("FilterProfile")}
          style={{
            marginTop: 20,
            height: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignSelf: "center",
            flexDirection: "column",
            backgroundColor: "white"
          }}
        >
          <Text
            style={{
              color: CONSTANTS.MY_BLUE,
              textAlign: "center",
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              marginHorizontal: 25
            }}
          >
            Filter Now!
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
  _renderHeader() {
    if (this.props.user.loggedStatus != "guest" && this.state.filterType == "suggest") {
      return this._renderFilterHeader();
    }

    let headerPhoto = require("../assets/xd/background/people_bg.png");
    let title1 = "Hello!";
    let title2 = "Keep in touch with all of your friends!";
    if (this.props.sortType == "POPULAR") {
      headerPhoto = require("../assets/xd/background/discover_popular_header.png");
      title1 = "Welcome";
      title2 = "Discover trending conversations and people";
    }
    if (this.props.sortType == "LOCATION") {
      headerPhoto = require("../assets/xd/background/dicover_location_bg.png");
      title1 = "Discover";
      title2 = "local conversations and people";
    }

    return (
      <ImageBackground
        source={headerPhoto}
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: 180
        }}
      >
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}>
          {title1}
        </Text>
        <Text style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL
        }}>{title2}</Text>
      </ImageBackground>
    );
  }
  componentDidMount() {
    // this._refreshData();
    //grant permission
    getCurrentLocation(position => {
      this.props.dispatch({
        type: "UPDATE_LONG_LAT",
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }
      });
    });
  }
  _generateKey(a, b) {
    return a.toString() + b.toString();
  }
  handleSearchTouch() {
    this.setState({ ...this.state, isSearch: !this.state.isSearch });
  }
  handleLoadMore() {
    if (this.state.people.length < 20) return;
    this.setState({ isLoading: true });
    getListOfFriends(
      this.props.user.accessToken,
      this.props.user.userId,
      this.state.filterType,
      0,
      20,
      res => {
        this.setState({ people: this.state.people.concat(res.data.data), isLoading: false });
      },
      err => {
        this.setState({ isLoading: false });
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      }
    );
  }
  _renderItem = ({ item, index }) => <PersonRowItem data={item} navigation={this.props.navigation} />;
  _keyExtractor = (item, index) => item.id.toString() + index.toString() + item.fullName;

  render() {
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            this._loadingData();
          }}
        />
        <View
          style={{
            flex: 100 + CONSTANTS.SPARE_HEADER,
            flexDirection: "column",
            height: 120,
            backgroundColor: "white"
          }}
        >
          {/* <StatusBar /> */}
          <View style={{ flexDirection: "row", marginTop: CONSTANTS.SPARE_HEADER }}>
            <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
              <Image
                source={{ uri: this.props.user.avatarUrl }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  marginLeft: 10
                }}
              />
            </TouchableOpacity>
            <SearchBar navigation={this.props.navigation} />
          </View>
          <PeopleHeader
            callback={tab => {
              this._refreshData(tab);
            }}
            currentTab={this.state.filterType}
          />
        </View>
        <View
          style={{
            // backgroundColor: "gray",
            flex: CONSTANTS.HEIGHT - 55 - 100 - CONSTANTS.SPARE_FOOTER - CONSTANTS.SPARE_HEADER
          }}
        >
          <FlatList
            style={{
              backgroundColor: CONSTANTS.MY_GRAYBG,
              flexDirection: "column"
            }}
            // keyboardShouldPersistTaps="handled"
            // onRefresh={this._refreshData()}
            refreshing={this.state.isLoading}
            data={this.state.people}
            // initialNumToRender={20}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.8}
            ListFooterComponent={() => (this.state.isLoading ? <LoadingSpinner /> : null)}
            ListHeaderComponent={this._renderHeader}
          />
        </View>

        <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
          <Footer {...this.props} active="people" />
        </View>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user
});
const PeopleListContainer = connect(mapStateToProps)(PeopleListScreen);
export default PeopleListContainer;
