import React, {Component} from 'react';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import CONSTANTS from '../common/PeertalConstants';
import {Icon} from 'native-base';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this._handleTouchOnProfile = this._handleTouchOnProfile.bind(this);
  }
  _handleTouchOnProfile() {
    if (this.props.user.loggedStatus == 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    this.props.navigation.navigate('EditProfile');
  }
  render() {
    const version = DeviceInfo.getVersion();
    return (
      <View style={{flexDirection: 'column', height: '100%'}}>
        <View
          style={{
            height: 48,
            marginTop: CONSTANTS.SPARE_HEADER,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.2,
            borderBottomWidth: 1,
            borderBottomColor: 'white',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <View
            style={{
              marginLeft: 0,
              width: CONSTANTS.WIDTH,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              }}>
              SETTINGS
            </Text>
          </View>
          <TouchableOpacity
            style={{marginLeft: -CONSTANTS.WIDTH + 16}}
            onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrowleft" type="AntDesign" />
          </TouchableOpacity>
        </View>
        <Text style={styles.header1}>General</Text>

        <TouchableOpacity
          onPress={this._handleTouchOnProfile}
          style={styles.header2}>
          <Icon name="md-person" style={{fontSize: 18}} />
          <Text style={styles.textItem}>Profile</Text>
        </TouchableOpacity>
        <View style={styles.header2}>
          <Icon name="bell" type="FontAwesome" style={{fontSize: 18}} />
          <Text style={styles.textItem}>Notifications</Text>
        </View>
        <Text style={styles.header1}>About</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('About')}
          style={styles.header2}>
          <Icon name="ios-information-circle" style={{fontSize: 18}} />
          <Text style={styles.textItem}>About Kuky</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('TandC')}
          style={styles.header2}>
          <Icon name="ios-paper" type="Ionicons" style={{fontSize: 18}} />
          <Text style={styles.textItem}>Terms & Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
          style={styles.header2}>
          <Icon name="lock" type="FontAwesome" style={{fontSize: 18}} />
          <Text style={styles.textItem}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.header1}>Support</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Contact')}
          style={styles.header2}>
          <Icon name="phone" type="FontAwesome" style={{fontSize: 18}} />
          <Text style={styles.textItem}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('FAQ')}
          style={styles.header2}>
          <Icon name="questioncircle" type="AntDesign" style={{fontSize: 18}} />
          <Text style={styles.textItem}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ReportProblem')}
          style={styles.header2}>
          <Icon name="md-bug" type="Ionicons" style={{fontSize: 18}} />
          <Text style={styles.textItem}>Report a problem</Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            marginBottom: CONSTANTS.SPARE_FOOTER,
            width: '100%',
            fontSize: 11,
            color: 'gray',
          }}>
          You are using Kuky version {version}.{'\n'}
          Made with love by a Global team. Copyright by Kuky@2019
        </Text>
      </View>
    );
  }
}
const mapStateToProps = store => ({
  user: store.user,
});
const SettingsContainer = connect(mapStateToProps)(SettingsScreen);
export default SettingsContainer;
const styles = {
  header1: {
    marginLeft: 16,
    color: CONSTANTS.MY_BLUE,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 18,
    marginTop: 30,
  },
  header2: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 16,
  },
  textItem: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
  },
};
