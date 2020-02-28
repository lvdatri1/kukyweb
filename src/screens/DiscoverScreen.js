import lodash from 'lodash';
import firebase from 'react-native-firebase';
import {Icon} from 'native-base';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {getCurrentLocation} from '../actions/commonActions';
import {fetchPosts, refreshPosts} from '../actions/postActions';
import {
  requestToReceivePushPermission,
  goToPage,
  goToLink,
} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {LoadingSpinner, Text} from '../components/CoreUIComponents';
import DiscoverHeaderContainer from '../components/DiscoverHeader';
import Footer from '../components/Footer';
import PostItem from '../components/PostItem';
import SendBird from 'sendbird';
import SearchBar from '../components/SearchBar';
import {initChatConnectionToSendBird} from '../actions/chatActions';

class MapViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {isSearch: false};
    this.handleSearchTouch = this.handleSearchTouch.bind(this);
    this.renderPostList = this.renderPostList.bind(this);
    this._generateKey = this._generateKey.bind(this);
    this.handleRefreshTimeLine = this.handleRefreshTimeLine.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.renderData = this.renderData.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
  }
  handleRefreshTimeLine() {
    if (this.props.isLoading) return;
    this.props.dispatch(
      refreshPosts(
        this.props.user.accessToken,
        this.props.sortType,
        this.props.user.longitude,
        this.props.user.latitude,
      ),
    );
  }
  _renderHeader() {
    if (this.props.user.loggedStatus != 'guest') return null;

    let headerPhoto = require('../assets/xd/background/discover_bg.png');
    let title1 = 'Welcome!';
    let title2 = "Here's what new since your last visit";
    if (this.props.sortType == 'POPULAR') {
      headerPhoto = require('../assets/xd/background/discover_popular_header.png');
      title1 = 'Welcome!';
      title2 = 'Discover trending conversations and people';
    }
    if (this.props.sortType == 'LOCATION') {
      headerPhoto = require('../assets/xd/background/dicover_location_bg.png');
      title1 = 'Discover';
      title2 = 'local conversations and people';
    }

    return (
      <ImageBackground
        source={headerPhoto}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          height: 180,
        }}>
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}>
          {title1}
        </Text>
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
          }}>
          {title2}
        </Text>
      </ImageBackground>
    );
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'UPDATE_REACT_NAVIGATION_PROPS',
      data: {navigation: this.props.navigation},
    });
    if (CONSTANTS.OS == 'android') {
      const channel = new firebase.notifications.Android.Channel(
        'kuky1',
        'kyky app',
        firebase.notifications.Android.Importance.Max,
      ).setDescription('Kuky app channel');
      // Create the channel
      firebase.notifications().android.createChannel(channel);
    }
    //init SendBird

    if (this.props.user.loggedStatus != 'guest')
      initChatConnectionToSendBird(
        this.props.user.userId.toString(),
        this.props.user.fullName,
        this.props.user.avatarUrl,
      );
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // const action = notificationOpen.action; //in ios: it is touch
        const notification = notificationOpen.notification;
        const data = notification.data;
        goToLink(this.props.navigation, data.link);
        if (CONSTANTS.OS == 'ios') notification.ios.setBadge(0);
      });
    //
    this.handleLoadMore();
    //grant permission
    requestToReceivePushPermission();
    getCurrentLocation(position => {
      this.props.dispatch({
        type: 'UPDATE_LONG_LAT',
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
      });
    });
  }
  componentWillUnmount() {
    this.notificationOpenedListener();
    // this.removeNotificationListener();
  }
  _generateKey(a, b) {
    return a.toString() + b.toString();
  }
  handleSearchTouch() {
    this.setState({...this.state, isSearch: !this.state.isSearch});
  }
  handleLoadMore() {
    if (this.props.isLoading == false)
      this.props.dispatch(
        fetchPosts(
          this.props.posts.length,
          this.props.user.accessToken,
          this.props.posts.sortType,
          this.props.user.longitude,
          this.props.user.latitude,
        ),
      );
    return;
  }
  _renderItem = ({item, index}) => (
    <PostItem
      navigation={this.props.navigation}
      id={item.id}
      data={item}
      key={this._generateKey(item.id, index)}
    />
  );
  _keyExtractor = (item, index) => item.id.toString(); //+ index.toString();
  renderData() {
    let tempPosts;
    tempPosts = this.props.posts;
    if (this.props.sortType == 'POPULAR')
      tempPosts = lodash.orderBy(this.props.posts, ['noOfLikes'], ['desc']);
    if (this.props.sortType == 'TIMELINE')
      tempPosts = lodash.orderBy(this.props.posts, ['createdAt'], ['desc']);
    return tempPosts;
  }
  renderPostList() {
    let tempPosts;
    if (this.props.sortType == 'POPULAR')
      tempPosts = lodash.orderBy(this.props.posts, ['noOfLikes'], ['desc']);
    if (this.props.sortType == 'TIMELINE')
      tempPosts = lodash.orderBy(this.props.posts, ['createdAt'], ['desc']);

    return tempPosts.map((item, index) =>
      item == null ? (
        <View id={index} key={index} />
      ) : (
        <PostItem
          data={item}
          id={item.id}
          key={this._generateKey(item.id, index)}
        />
      ),
    );
  }

  render() {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        <View
          style={{
            flex: 100 + CONSTANTS.SPARE_HEADER,
            flexDirection: 'column',
            height: 120,
            backgroundColor: 'white',
          }}>
          {/* <StatusBar /> */}
          <View
            style={{flexDirection: 'row', marginTop: CONSTANTS.SPARE_HEADER}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.toggleDrawer()}>
              <Image
                source={{uri: this.props.user.avatarUrl}}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
            <SearchBar navigation={this.props.navigation} />
          </View>
          <DiscoverHeaderContainer />
        </View>
        <View
          style={{
            flex:
              CONSTANTS.HEIGHT -
              55 -
              100 -
              CONSTANTS.SPARE_FOOTER -
              CONSTANTS.SPARE_HEADER,
          }}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            onRefresh={this.handleRefreshTimeLine}
            refreshing={this.props.isLoading && this.props.posts.length == 0}
            data={this.props.posts}
            initialNumToRender={10}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.8}
            ListFooterComponent={() =>
              this.props.isLoading && this.props.posts.length != 0 ? (
                <LoadingSpinner />
              ) : null
            }
            ListHeaderComponent={this._renderHeader}
          />
        </View>

        <View style={{flex: 55 + CONSTANTS.SPARE_FOOTER}}>
          {/* <Footer {...this.props} active={'feed'} /> */}
          <Footer {...this.props} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  posts: store.posts.posts,
  postLen: store.posts.postLen,
  isLoading: store.posts.isLoading,
  sortType: store.posts.sortType,
  user: store.user,
});
const MapViewContainer = connect(mapStateToProps)(MapViewScreen);
export default MapViewContainer;
