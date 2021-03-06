import React, {Component} from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import CONSTANTS from '../common/PeertalConstants';
import {Icon} from 'native-base';
import {getPageInfo} from '../actions/commonActions';
import {OverlayLoading} from '../components/CoreUIComponents';
import {WebView} from 'react-native-webview';

export default class PrivacyPolicyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    this.setState({isLoading: true});
    getPageInfo('pp', res => {
      this.setState({isLoading: false, pageData: res.data.data});
    });
  }

  render() {
    const title = '';
    const pageName1 = 'Privacy';
    const pageName2 = 'Policy';
    const body =
      this.state.pageData != null
        ? this.state.pageData.body
        : '<body>no data</body>';
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
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>{title}</Text>
          </View>
          <TouchableOpacity
            style={{marginLeft: -CONSTANTS.WIDTH + 16}}
            onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrowleft" type="AntDesign" />
          </TouchableOpacity>
        </View>
        <ImageBackground
          style={{
            width: '100%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../assets/xd/header/Privacy_Policy_header.png')}>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              alignSelf: 'center',
              color: 'white',
              fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
            }}>
            {pageName1}
          </Text>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              alignSelf: 'center',
              color: 'white',
              fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
            }}>
            {pageName2}
          </Text>
        </ImageBackground>
        <WebView
          source={{html: `
          <style>
            p{font-size: 2.3rem; font-family: Montserrat}
            ul{font-size: 2.3rem; font-family: Montserrat}
            strong{color:deepskyblue; font-size: 3rem; font-family: Montserrat}
          </style>
          ` + body }}
          style={{
            marginHorizontal: 12,
            marginBottom: CONSTANTS.SPARE_FOOTER,
            marginTop: 20,
          }}
        />
        {this.state.isLoading ? <OverlayLoading /> : null}
      </View>
    );
  }
}

const styles = {
  header1: {
    marginLeft: 16,
    color: CONSTANTS.MY_BLUE,
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
  },
};
