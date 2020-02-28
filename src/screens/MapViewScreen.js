import lodash from "lodash";
import { Icon, Input, Item, Text, Title } from "native-base";
import React, { Component } from "react";
import { Image, ImageBackground, TouchableOpacity, View, ScrollView } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { connect } from "react-redux";
import { getCurrentLocation } from "../actions/commonActions";
import { fetchPosts, getNearbyPosts, refreshPosts } from "../actions/postActions";
import { getNearbyPeople, getListOfSuggestedFriends } from "../actions/peopleActions";
import { requestToReceivePushPermission, goToProfile } from "../actions/userActions";
import CONSTANTS from "../common/PeertalConstants";
import { OverlayLoading } from "../components/CoreUIComponents";
import DiscoverHeaderContainer from "../components/DiscoverHeader";
import Footer from "../components/Footer";
// import PostDetailModal from "../components/PostDetailModal";
import PostItem from "../components/PostItem";
import PostObject from "../models/PostObject";
import UserObject from "../models/UserObject";
import SearchBar from "../components/SearchBar";

//@flow
class DiscoverScreen extends Component {
  constructor(props) {
    super(props);
    this.myMapView = React.createRef();
    this.state = {
      isSearch: false,
      posts: [],
      people: [],
      selectedTab: "conversation",
      isLoading: false,
      longitudeDelta: 0.0922,
      latitudeDelta: 0.0421,
      longitude: 0,
      latitude: 0,
      postDetailData: new PostObject()
    };
    this.handleSearchTouch = this.handleSearchTouch.bind(this);
    this._generateKey = this._generateKey.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._renderPostMarkers = this._renderPostMarkers.bind(this);
    this._renderPeopleMarkers = this._renderPeopleMarkers.bind(this);
    this.handleLoadData = this.handleLoadData.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this._renderHeaderTab = this._renderHeaderTab.bind(this);
    this._selectTab = this._selectTab.bind(this);
    this._goBackToCurrentRegion = this._goBackToCurrentRegion.bind(this);
  }
  _selectTab(tab = "conversation") {
    this.setState({ selectedTab: tab });
    this.handleLoadData(this.state.longitude, this.state.latitude, tab);
  }
  _goBackToCurrentRegion() {
    this.myMapView.current.animateToRegion({
      longitude: this.props.user.longitude,
      latitude: this.props.user.latitude,
      longitudeDelta: 0.0922,
      latitudeDelta: 0.0421
    });
  }

  _renderHeaderTab() {
    return (
      <View style={{ height: 68, justifyContent: "center", flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => this._selectTab("people")}
          style={{
            flexDirection: "row",
            height: 68,
            alignItems: "center",
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: this.state.selectedTab == "people" ? 1 : 0.2
            }}
          >
            People
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this._selectTab("conversation")}
          style={{
            flexDirection: "row",
            height: 68,
            alignItems: "center",
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: this.state.selectedTab == "conversation" ? 1 : 0.2
            }}
          >
            Conversation
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  handleRegionChange(region) {
    this.setState({
      longitude: region.longitude,
      latitude: region.latitude,
      longitudeDelta: region.longitudeDelta,
      latitudeDelta: region.latitudeDelta
    });
    this.handleLoadData(region.longitude, region.latitude, this.state.selectedTab);
  }

  componentDidMount() {
    //grant permission
    requestToReceivePushPermission();
    getCurrentLocation(position => {
      this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude }, () =>
        this.handleLoadData(position.coords.longitude, position.coords.latitude)
      );
      this.props.dispatch({
        type: "UPDATE_LONG_LAT",
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }
      });
      //load data after
    });
  }
  _generateKey(a, b) {
    return a.toString() + b.toString();
  }
  handleSearchTouch() {
    this.setState({ ...this.state, isSearch: !this.state.isSearch });
  }
  handleLoadData(lon, lat, tab = "conversation") {
    if (this.state.isLoading == false) {
      this.setState({ isLoading: true });
      if (tab === "conversation") {
        getNearbyPosts(
          this.props.user.accessToken,
          undefined,
          undefined,
          undefined,
          lon || this.state.longitude, // this.props.user.longitude,
          lat || this.state.latitude, // this.props.user.latitude,
          100,
          undefined,
          res => {
            // alert("success");
            this.setState({ posts: res.data.data.posts, isLoading: false });
          },
          err => {
            alert("some errors with connections " + err.message);
            this.setState({ isLoading: false });
          }
        );
      } else {
        getNearbyPeople(
          this.props.user.accessToken,
          this.props.user.userId,
          lon || this.state.longitude, // this.props.user.longitude,
          lat || this.state.latitude, // this.props.user.latitude,
          this.props.user.filterFriends,
          0,
          20,
          res => {
            this.setState({ people: res.data.data, isLoading: false });
          },
          err => {
            this.setState({ isLoading: false });
            CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
          }
        );
      }
    }
  }

  _renderItem = ({ item, index }) => <PostItem id={item.id} data={item} key={this._generateKey(item.id, index)} />;
  _keyExtractor = (item, index) => item.id.toString() + index.toString();
  _renderPeopleMarkers() {
    if (this.state.people == null || this.state.posts.length < 1) return null;
    return this.state.people.map((item, index) => {
      let location = item.location;
      // console.log("longlat", item);
      if (location == null) location = { lon: 174, lat: -41 };
      let user = item || new UserObject();
      const name = user.fullName;
      let imageUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
      const { introduction, occupation } = item;
      let lon =
        parseFloat(location.lon) - this.state.longitudeDelta / 10 + (Math.random() * this.state.longitudeDelta) / 5;
      let lat =
        parseFloat(location.lat) - this.state.latitudeDelta / 10 + (Math.random() * this.state.latitudeDelta) / 5;

      return (
        <Marker
          key={index}
          title={name}
          description={introduction}
          // pinColor="red"
          // draggable
          coordinate={{ latitude: lat, longitude: lon }}
        >
          <Image
            style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: "white" }}
            source={{ uri: imageUrl }}
          />
          <Callout
            onPress={() => {
              // alert("click on callout");
              goToProfile(this.props.navigation, item.id);
            }}
            style={{ width: 104, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{name}</Text>
            <Text>{occupation}</Text>
          </Callout>
        </Marker>
      );
    });
  }
  _renderPostMarkers() {
    if (this.state.posts == null || this.state.posts.length < 1) return null;
    return this.state.posts.map((item, index) => {
      let location = item.location;
      // console.log("longlat", item);
      if (location == null) location = { lon: 174, lat: -41 };
      let user = item.user || new UserObject();
      const name = user.fullName;
      let imageUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
      const content = item.content;
      let lon =
        parseFloat(location.lon) - this.state.longitudeDelta / 10 + (Math.random() * this.state.longitudeDelta) / 5;
      let lat =
        parseFloat(location.lat) - this.state.latitudeDelta / 10 + (Math.random() * this.state.latitudeDelta) / 5;
      let mediaUrl = CONSTANTS.RANDOM_IMAGE;
      if (item.media != [] && item.media.length > 0) {
        mediaUrl = item.media[0].url;
      }
      return (
        <Marker
          key={index}
          title={name}
          description={content}
          // pinColor="red"
          // draggable
          coordinate={{ latitude: lat, longitude: lon }}
        >
          <Image
            style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: "white" }}
            source={{ uri: imageUrl }}
          />
          <Callout
            onPress={() => {
              // alert("click on callout");
              this.props.navigation.navigate("PostDetails", {
                postId: item.id
              });
            }}
            style={{ width: 104, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={{ uri: mediaUrl }}
              style={{ height: 50, backgroundColor: "red", width: 100, resizeMode: "cover" }}
            />
            <Text>{content}</Text>
          </Callout>
        </Marker>
      );
    });
  }

  render() {
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
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
          {this._renderHeaderTab()}
        </View>
        <View
          style={{
            flex: CONSTANTS.HEIGHT - 55 - 100 - CONSTANTS.SPARE_FOOTER - CONSTANTS.SPARE_HEADER
          }}
        >
          <MapView
            ref={this.myMapView}
            style={{ height: "100%", width: "100%" }}
            initialRegion={{
              latitude: this.props.user.latitude,
              longitude: this.props.user.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            zoomEnabled={true}
            zoomTapEnabled={true}
            scrollEnabled={true}
            showsMyLocationButton={true}
            showsUserLocation={true}
            // followsUserLocation={true}
            userLocationAnnotationTitle={"You are here"}
            // onRegionChange={this.handleRegionChange}
            onRegionChangeComplete={this.handleRegionChange}
            // loadingEnabled={true}
          >
            {this.state.selectedTab === "conversation" ? this._renderPostMarkers() : this._renderPeopleMarkers()}
          </MapView>
          <View style={{ marginTop: -60, flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={this._goBackToCurrentRegion}
              style={{
                marginLeft: 20,
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: CONSTANTS.MY_BLUE
              }}
            >
              <Icon name="location-arrow" type="FontAwesome5" style={{ fontSize: 18, color: "white" }}></Icon>
            </TouchableOpacity>
            <View>{this.state.isLoading ? <Text>Loading...</Text> : null}</View>
            <TouchableOpacity
              disabled={this.state.selectedTab === "conversation"}
              onPress={() => this.props.navigation.navigate("FilterProfile")}
              style={{
                marginRight: 20,
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: CONSTANTS.MY_BLUE,
                opacity: this.state.selectedTab !== "conversation" ? 1 : 0
              }}
            >
              <Icon name="filter" type="FontAwesome5" style={{ fontSize: 18, color: "white" }}></Icon>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
          {/* <Footer {...this.props} active={'feed'} /> */}
          <Footer {...this.props} active="mapView" />
        </View>
        {this.state.isLoading ? null : null}
      </View>
    );
  }
}

const mapStateToProps = store => ({
  posts: store.posts.posts,
  postLen: store.posts.postLen,
  isLoading: store.posts.isLoading,
  sortType: store.posts.sortType,
  user: store.user
});
const DiscoverScreenContainer = connect(mapStateToProps)(DiscoverScreen);
export default DiscoverScreenContainer;

const styles = {
  header: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 24
  }
};
