import {Icon, Picker} from 'native-base';
import React, {Component} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getDeviceFirebaseToken,
  loginViaEmailOrSMS,
} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {OverlayLoading, Text} from '../components/CoreUIComponents';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourPhone: '',
      isLoading: false,
      country: 'Australia',
      currentCode: '+61',
      devicePushToken: '',
    };
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  onLoginSubmit() {
    if (this.state.isLoading) return;
    //request get access Token of firebase
    this.setState({...this.state, isLoading: true});
    const myPhone =
      this.state.currentCode.toString() + this.state.yourPhone.toString();
    loginViaEmailOrSMS(
      myPhone,
      'phone',
      this.state.devicePushToken,
      res => {
        this.setState({...this.state, isLoading: false});
        console.log('email is correct', res.data);
        if (res.data.data.account_type == 'existed')
          this.props.navigation.navigate('ActivationCode', {
            loginId: this.state.currentCode + this.state.yourPhone,
          });
        else
          this.props.navigation.navigate('FirstTimeUser', {
            loginId: this.state.currentCode + this.state.yourPhone,
            type: 'phone',
          });
      },
      err => {
        alert(err);
        this.setState({...this.state, isLoading: false});
      },
    );
  }
  componentDidMount() {
    getDeviceFirebaseToken(token => {
      // alert(token);
      this.setState({devicePushToken: token});
    });
  }
  render() {
    let currentCountryCode = '+61';
    return (
      <ImageBackground
        source={require('../assets/xd/background/Login-bg.png')}
        style={{width: '100%', height: '100%'}}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon
              name="arrowleft"
              type="AntDesign"
              style={{marginTop: CONSTANTS.SPARE_HEADER, marginLeft: 15}}
            />
          </TouchableOpacity>
          <View
            style={{
              marginTop: (120 / 812) * CONSTANTS.HEIGHT,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 22, fontWeight: '200'}}>
              PROVIDE US YOUR
            </Text>
            <Text style={{fontSize: 36, fontFamily: 'Montserrat-SemiBold'}}>
              Phone Number
            </Text>
          </View>
          <View
            style={{
              maxWidth: CONSTANTS.WIDTH - 100,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>
              We will send a code that you can start contributing to the
              community
            </Text>
          </View>
          <View style={{}}>
            <View
              style={{
                paddingLeft: 15,
                alignItems: 'flex-start',
                marginTop: 30,
                flexDirection: 'row',
              }}>
              <Icon
                name={'phone'}
                type={'MaterialIcons'}
                style={{fontSize: 22, marginRight: 6, marginLeft: 2}}
              />
              <Text style={{fontSize: 14, alignSelf: 'center'}}>
                Your Phone
              </Text>
            </View>
            <View>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 15,
                  marginRight: 15,
                  borderColor: 'gray',
                  borderWidth: 1,
                  alignItems: 'flex-start',
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" style={{marginLeft: 0}} />}
                  style={{width: CONSTANTS.WIDTH - 40, height: 39}}
                  placeholder="Select your country"
                  placeholderStyle={{color: '#bfc6ea', fontSize: 14}}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.country}
                  onValueChange={item => {
                    var theCountry = listCountries.find(element => {
                      return element.country == item;
                    });
                    // alert(listID);
                    this.setState({
                      ...this.state,
                      country: theCountry.country,
                      currentCode: theCountry.phoneCode,
                    });
                  }}>
                  {listCountries.map(item => {
                    return (
                      <Picker.Item
                        label={item.country}
                        value={item.country}
                        key={item.country}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 15,
                  marginRight: 15,
                  borderColor: 'gray',
                  borderWidth: 1,
                  alignItems: 'center',
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <Text style={{alignSelf: 'center', marginLeft: 10}}>
                  {this.state.currentCode}
                </Text>
                <TextInput
                  textContentType={'telephoneNumber'}
                  keyboardType={'phone-pad'}
                  placeholder="your phone number"
                  style={{
                    fontSize: 14,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    width: CONSTANTS.WIDTH - 120,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
                  }}
                  onChangeText={text =>
                    this.setState({...this.state, yourPhone: text})
                  }
                  value={this.state.yourPhone}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                disabled={this.state.isLoading}
                onPress={this.onLoginSubmit}
                style={{
                  flex: 1,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  borderRadius: 20,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  maxWidth: '100%',
                  padding: 10,
                  margin: 10,
                }}>
                <Icon
                  name={'phone'}
                  type={'MaterialIcons'}
                  style={{
                    color: 'white',
                    fontSize: 22,
                    marginRight: 6,
                    marginLeft: 2,
                  }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    alignSelf: 'center',
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  Send me code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.state.isLoading ? <OverlayLoading /> : null}
      </ImageBackground>
    );
  }
}

const MapStateToProps = store => ({user: store.user});
const LoginContainer = connect(MapStateToProps)(LoginScreen);
export default LoginContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 4,
  },
  mainButtons: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerButtons: {
    flex: 4,
    justifyContent: 'space-between',
  },
  siginText: {
    marginTop: '50%',
    fontSize: 45,
    alignSelf: 'center',
    // fontWeight: 'bold',
    fontFamily: 'SF Pro Display',
  },
  discoverText: {
    fontSize: 25,
    alignSelf: 'center',
    fontFamily: 'HelveticaNeue-Light',
    fontWeight: '200',
  },
  button: {},
  socialButton: {
    backgroundColor: 'red',
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },
  txtButton: {},
});

const listCountries = [
  {
    country: 'Australia',
    phoneCode: '+61',
    code: 'AU',
  },
  {
    country: 'New Zealand',
    phoneCode: '+64',
    code: 'NZ',
  },
  {
    country: 'Vietnam',
    phoneCode: '+84',
    code: 'NZ',
  },
];
