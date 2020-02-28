import React, {Component} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import CONSTANTS from '../common/PeertalConstants';
import {Text} from '../components/CoreUIComponents';
import {goToLink} from '../actions/userActions';
import StyledText from 'react-native-styled-text';

export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.handleTouchOnAvatar = this.handleTouchOnAvatar.bind(this);
    this.handleTouchOnMain = this.handleTouchOnMain.bind(this);
  }
  handleTouchOnAvatar() {
    this.props.navigation.navigate('UserProfile', {
      userId: this.props.data.user.id,
    });
  }
  handleTouchOnMain() {
    goToLink(this.props.navigation, this.props.data.link);
  }
  render() {
    const {data} = this.props;
    const avatarSource = data.user
      ? data.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR
      : CONSTANTS.DEFAULT_AVATAR;
    const fullName = data.user ? data.user.fullName : 'tetet';
    const message = data.title || 'left fun';
    let description = data.summary || 'no content';
    description = description.substring(0, 100);
    let createdAt = data.createdAt || Date();
    const mediaUrl = data.media.length > 0 ? data.media[0].url : null;
    const status = data.status;
    return (
      <View
        style={{
          //flex to be square
          backgroundColor: 'white',
          //   borderRadius: 10,
          flexDirection: 'row',
          //   margin: 15,
          padding: 15,
          marginBottom: 5,
          justifyContent: 'flex-start',
        }}>
        <TouchableOpacity onPress={this.handleTouchOnAvatar}>
          <Image
            source={{uri: avatarSource}}
            style={{width: 50, height: 50, borderRadius: 25}}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 10, width: CONSTANTS.WIDTH - 30 - 50 - 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <StyledText style={{fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT}}>
            {`<b>${fullName}</b>  ${message}`}
            </StyledText>
          </View>
          <TouchableOpacity
            onPress={this.handleTouchOnMain}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text
              style={{
                marginHorizontal: 10,
                color: status == 'new' ? CONSTANTS.MY_BLUE : CONSTANTS.MY_GREY,
                maxWidth: CONSTANTS.WIDTH - 170,
                minWidth: CONSTANTS.WIDTH - 170,
                flex: CONSTANTS.WIDTH - 170,
              }}>
              {description}
            </Text>
            {mediaUrl ? (
              <Image
                source={{uri: mediaUrl}}
                style={{width: 58, height: 58, flex: 58, maxWidth: 58}}
              />
            ) : null}
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: CONSTANTS.MY_GREY,
                fontSize: 12,
              }}>
              {CONSTANTS.getTimeDifference(createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
