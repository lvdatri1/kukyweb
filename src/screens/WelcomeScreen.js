import {Button, Icon} from 'native-base';
import JwtDecode from 'jwt-decode';
import React, {Component} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import CONSTANTS from '../common/PeertalConstants';
import {Text, OverlayLoading} from '../components/CoreUIComponents';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {loginViaSocial, getDeviceFirebaseToken} from '../actions/userActions';

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      facebookAccessToken: '',
      facebookUser: {},
    };
    this._loginWithFacebook = this._loginWithFacebook.bind(this);
    this._signInWithGG = this._signInWithGG.bind(this);
    this._responseInfoCallback = this._responseInfoCallback.bind(this);
    this._loginProceed = this._loginProceed.bind(this);
    this.onAppleButtonPress = this.onAppleButtonPress.bind(this);
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      // webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'UPDATE_REACT_NAVIGATION_PROPS',
      data: {navigation: this.props.navigation},
    });
    getDeviceFirebaseToken(token => {
      // alert(token);
      this.props.dispatch({
        type: 'GET_DEVICE_TOKEN',
        data: {
          deviceFirebaseToken: token,
        },
      });
    });
  }
  async onAppleButtonPress() {
    const self = this;
    // performs login request
    console.log('login apple');
    try {
      //logout first to not get null value;
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });
      console.log('login apple here', appleAuthRequestResponse);
      // get current authentication state for user
      let appleProfile = {
        ...appleAuthRequestResponse,
        email: appleAuthRequestResponse.email,
        name:
          appleAuthRequestResponse.fullName.givenName +
          ' ' +
          appleAuthRequestResponse.fullName.familyName,
      };
      if (appleAuthRequestResponse.email) {
        this.props.dispatch({
          type: 'UPDATE_APPLE_SIGN_IN',
          data: {
            user: appleAuthRequestResponse.user,
            email: appleAuthRequestResponse.email,
            fullName:
              appleAuthRequestResponse.fullName.givenName +
              ' ' +
              appleAuthRequestResponse.fullName.familyName,
          },
        });
        console.log('user redux', this.props.user);
      } else {
        console.log('token', appleAuthRequestResponse.identityToken);
        const decoded = JwtDecode(appleAuthRequestResponse.identityToken);
        console.log(decoded);
        appleProfile = {
          email: decoded.email,
          //fullName: this.props.user.appleSignInUser.fullName,
        };
      }
      self._loginProceed(appleAuthRequestResponse.identityToken, 'Apple', {
        ...appleProfile,
      });
      // use credentialState response to ensure the user is authenticated
    } catch (e) {
      alert('Login apple error');
      console.log('login apple', e);
    }
  }
  _loginProceed(token, provider, profile) {
    const profileData = {
      ...profile,
      fullName: profile.name,
      username: profile.email,
    };
    console.log('login here', profileData);
    loginViaSocial(
      token,
      provider,
      profileData,
      this.props.user.deviceFirebaseToken,
      res => {
        let response = res.data;
        console.log('token is: ' + response.data.user_data.token);
        console.log(response);
        this.setState({isLoading: false});
        if (response.status === 200) {
          this.props.dispatch({
            type: 'USER_RECEIVE_LOG_IN_SUCCESSFULLY',
            data: {
              user_data: response.data.user_data,
              accessToken: response.data.user_data.token,
              settings: response.data.settings,
            },
          });
          this.props.dispatch({
            type: 'LOGGED_MENU',
          });
          this.props.navigation.navigate('MainFlow');
          console.log('MainFlow');
        } else {
          alert(response.message);
        }
      },
    );
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      //login success
      this._loginProceed(this.state.facebookAccessToken, 'facebook', result);
    }
  }
  _signInWithGG = async () => {
    const self = this;
    try {
      // const isSignedIn = await GoogleSignin.isSignedIn();
      // let userInfo;
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const tok = await GoogleSignin.getTokens();

      if (userInfo !== null) {
        this.setState({userInfo});
        console.log('here is gg', userInfo);
        console.log('here is gg', tok);

        self._loginProceed(tok.accessToken, 'Google', {
          ...userInfo.user,
        });
      }
    } catch (error) {
      alert('error at GG login');
      console.log('error at GG login', error);
    }
  };

  _loginWithFacebook() {
    const self = this;
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['email'])
      .then(result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          // alert("login success");
          console.log('Login success with permissions: ', result);
          AccessToken.getCurrentAccessToken()
            .then(data => {
              const tokenF = data.accessToken;
              self.setState({facebookAccessToken: tokenF});
              //alert(token.toString());
              const requestConfig = {
                parameters: {
                  fields: {
                    string: 'email,name,picture',
                  },
                  access_token: {
                    string: tokenF.toString(), // put your accessToken here
                  },
                },
              };
              //after login
              const infoRequest = new GraphRequest(
                '/me',
                requestConfig,
                self._responseInfoCallback,
              );
              // // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start();
            })
            .catch(err => {
              alert('error getCurrentAccessToken() ' + JSON.stringify(err));
            });
        }
      })
      .catch(error => {
        alert('Login fail with error: ' + JSON.stringify(error));
      });
  }
  render() {
    return (
      <View>
        <ImageBackground
          source={require('../assets/xd/background/Login-bg.png')}
          style={{width: '100%', height: '100%'}}>
          <View style={{flex: 1}}>
            <View style={{marginTop: CONSTANTS.SPARE_HEADER}}>
              <TouchableOpacity
                style={{marginLeft: 15}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrowleft" type="AntDesign" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 120,
                flexDirection: 'column',
                flex: 1,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 36,
                  // fontWeight: "400",
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Please sign in
              </Text>
              <Text style={{fontSize: 22, fontFamily: 'Montserrat-Light'}}>
                TO DISCOVER MORE
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <Button
                rounded
                style={{
                  flex: 1,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  maxWidth: '40%',
                }}
                onPress={() => {
                  this.props.navigation.navigate('LoginViaEmail');
                }}>
                <Icon
                  name={'mail'}
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
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  By Email
                </Text>
              </Button>

              <Button
                rounded
                style={{
                  flex: 1,
                  backgroundColor: CONSTANTS.MY_PURPLE,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  maxWidth: '40%',
                }}
                onPress={() => {
                  this.props.navigation.navigate('LoginViaSMS');
                }}>
                <Icon
                  name={'phone'}
                  type={'MaterialIcons'}
                  style={{
                    color: 'white',
                    fontSize: 22,
                    marginRight: 2,
                    marginLeft: 2,
                  }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  By SMS
                </Text>
              </Button>
            </View>
            <View style={{flex: 4}}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginTop: 30,
                }}>
                <Text>Or you can log in by</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                }}>
                {/* <LoginButton
                style={{ fontSize: 16, width: 190, height: 48, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}
                onLoginFinished={(error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    console.log("here is relsut", result);
                    AccessToken.getCurrentAccessToken().then(data => {
                      console.log(data.accessToken.toString());
                    });
                  }
                }}
                onLogoutFinished={() => console.log("logout.")}
              />
              <GoogleSigninButton
                style={{ width: 196, height: 48, marginVertical: 10 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={this.signIn}
                // disabled={this.state.isSigninInProgress}
              /> */}
                <TouchableOpacity
                  onPress={this._loginWithFacebook}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      borderColor: CONSTANTS.MY_BLUE,
                      borderWidth: 1,
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name={'facebook'}
                      type={'FontAwesome'}
                      style={{alignSelf: 'center', color: CONSTANTS.MY_BLUE}}
                    />
                  </View>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      color: CONSTANTS.MY_BLUE,
                      marginTop: 10,
                    }}>
                    Facebook
                  </Text>
                </TouchableOpacity>
                <View style={{width: 50}} />
                <TouchableOpacity
                  onPress={this._signInWithGG}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      borderColor: 'red',
                      borderWidth: 1,
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name={'google-plus'}
                      type={'FontAwesome'}
                      style={{alignSelf: 'center', color: 'red'}}
                    />
                  </View>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      color: 'red',
                      marginTop: 10,
                    }}>
                    Google
                  </Text>
                </TouchableOpacity>
              </View>
              {CONSTANTS.OS === 'ios' ? (
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <AppleButton
                    style={{width: '50%', height: 50, marginTop: 20}}
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_IN}
                    onPress={this.onAppleButtonPress}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </ImageBackground>
        {this.state.isLoading ? <OverlayLoading /> : null}
      </View>
    );
  }
}

const MapStateToProps = store => ({user: store.user});
const WelcomeContainer = connect(MapStateToProps)(WelcomeScreen);
export default WelcomeContainer;

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
