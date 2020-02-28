import React, {Component} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import CONSTANTS from '../common/PeertalConstants';
import {refreshPosts} from '../actions/postActions';
import {Text} from './CoreUIComponents';
class DiscoverHeader extends Component {
  constructor(props) {
    super(props);
    this.handleSelectType = this.handleSelectType.bind(this);
  }
  handleSelectType(sType) {
    if (this.props.posts.sortType === sType) return;
    this.props.dispatch({
      type: 'SELECT_SORT_TYPE',
      data: {
        sortType: sType,
      },
    });
    this.props.dispatch(
      refreshPosts(
        this.props.user.accessToken,
        sType,
        this.props.user.longitude,
        this.props.user.latitude,
        100,
      ),
    );
  }

  render() {
    const currentTab = this.props.posts.sortType;
    return (
      <View
        style={{
          height: 68,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => this.handleSelectType('TIMELINE')}
          style={{
            flexDirection: 'row',
            height: 68,
            marginLeft: currentTab == "TIMELINE" ? 33 : currentTab == "LOCATION" ? -45 : -9,
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: currentTab == 'TIMELINE' ? 1 : 0.2,
            }}>
            Timeline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleSelectType('POPULAR')}
          style={{
            flexDirection: 'row',
            height: 68,
            marginLeft: currentTab == "POPULAR" ? 39 : currentTab == "LOCATION" ? 42 : 39,
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: currentTab == 'POPULAR' ? 1 : 0.2,
            }}>
            Popular
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleSelectType('LOCATION')}
          style={{
            flexDirection: 'row',
            height: 68,
            marginLeft: currentTab == "LOCATION" ? 42 : 39,
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: currentTab == 'LOCATION' ? 1 : 0.2,
            }}>
            Local
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const MapStateToProps = store => ({posts: store.posts, user: store.user});
const DiscoverHeaderContainer = connect(MapStateToProps)(DiscoverHeader);
export default DiscoverHeaderContainer;

const styles = {
  header: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 24,
  },
};
