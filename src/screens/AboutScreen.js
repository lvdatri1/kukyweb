import {Icon} from 'native-base';
import React, {Component} from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {getPageInfo} from '../actions/commonActions';
import CONSTANTS from '../common/PeertalConstants';
import {OverlayLoading} from '../components/CoreUIComponents/';
//@flow
export default class AboutPageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    this.setState({isLoading: true});
    getPageInfo('about', res => {
      this.setState({isLoading: false, pageData: res.data.data});
    });
  }

  render() {
    const title = '';
    const pageName1 = 'About';
    const pageName2 = 'Kuky';
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
            onPress={() => this.props.navigation.goBack()}
            style={{marginLeft: -CONSTANTS.WIDTH + 16}}>
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
          source={require('../assets/xd/header/about_photo_header.png')}>
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
            strong{color:deepskyblue; font-size: 3rem; font-family: Montserrat}
          </style>
          ` + body }}
          style={{marginHorizontal: 12}}
        />
        {/* <Text
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
          You are using Kuky version 1.0.0. {'\n'}
          Made with love by a Global team. Copyright by Kuky@2019
        </Text> */}
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
