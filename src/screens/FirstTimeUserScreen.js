import {Icon} from 'native-base';
import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  getDeviceFirebaseToken,
  registerWithBase64,
} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {OverlayLoading} from '../components/CoreUIComponents';

export default class FirstTimeUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourFullName: 'enter your name',
      isLoading: false,
      avatarSource: require('../assets/xd/Icons/RegisterAvatar.png'),
      devicePushToken: '',
      avatarBase64: null,
    };
    this.onJoinAction = this.onJoinAction.bind(this);
    this.onCameraButtonPress = this.onCameraButtonPress.bind(this);
  }
  onCameraButtonPress = () => {
    // alert('hello')
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperChooseText: 'Choose',
      cropperToolbarTitle: 'Crop your photo here',
      includeExif: true,
      mediaType: 'any',
      forceJpg: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      includeBase64: true,
    }).then(image => {
      console.log('image base64:', image.data); //image.path ->uri
      this.setState({
        avatarSource: {uri: image.path},
      });
      this.setState({avatarBase64: 'data:image/png;base64, ' + image.data});
    });
  };

  onJoinAction() {
    if (this.state.isLoading) return;
    //request get access Token of firebase

    var loginId = this.props.navigation.getParam('loginId', 'noemail');

    var type = this.props.navigation.getParam('type', 'notype');
    console.log('param is here', loginId);
    // alert(loginId);
    const userData = {
      full_name: this.state.yourFullName,
      username: loginId,
      device_token: this.state.devicePushToken,
      device_type: CONSTANTS.OS,
      device_version: CONSTANTS.OS_VERSION,
      type: type,
      avatarBase64: this.state.avatarBase64,
    };
    this.setState({isLoading: true});
    registerWithBase64(
      userData,
      res => {
        // alert(res.data.result); //success
        console.log('register is done', res);
        this.setState({isLoading: false});
        this.props.navigation.navigate('ActivationCode', {loginId: loginId});
      },
      err => {
        console.log('error at first time user', err);
        // alert(err);
        this.setState({isLoading: false});
        this.props.navigation.navigate('ActivationCode', {loginId: loginId});
      },
    );
  }
  componentDidMount() {
    getDeviceFirebaseToken(token => {
      this.setState({devicePushToken: token});
    }, CONSTANTS.DEFAULT_ERROR_CALL_BACK);
  }
  render() {
    return (
      <ScrollView>
        <ImageBackground
          source={require('../assets/xd/background/Login-bg.png')}
          style={{width: '100%', height: '100%'}}>
          <TouchableOpacity
            style={{marginTop: CONSTANTS.SPARE_HEADER, marginLeft: 15}}
            onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrowleft" type="AntDesign" />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <View
              style={{
                marginTop: 150 - CONSTANTS.SPARE_HEADER,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: '400',
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                }}>
                First Time User
              </Text>
              <Text style={{fontSize: 22, fontWeight: '200'}}>
                Looks Like you're new to Kuky
              </Text>
            </View>
            <View
              style={{
                maxWidth: CONSTANTS.WIDTH - 100,
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                }}>
                It would be great if we could put a new name and avatar to the
                account
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{minHeight: 126, minWidth: 126}}
                onPress={this.onCameraButtonPress}>
                <Image
                  style={{height: 126, borderRadius: 126 / 2}}
                  source={this.state.avatarSource}
                />
              </TouchableOpacity>
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
                  name={'person'}
                  style={{fontSize: 22, marginRight: 6, marginLeft: 2}}
                />
                <Text style={{fontSize: 14, alignSelf: 'center'}}>
                  Your full name
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  borderColor: 'gray',
                  borderWidth: 1,
                  alignItems: 'flex-start',
                  borderRadius: 5,
                }}>
                <TextInput
                  textContentType={'emailAddress'}
                  style={{
                    fontSize: 14,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    width: CONSTANTS.WIDTH - 20,

                    // width: CONSTANTS.WIDTH - 30
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
                  }}
                  onChangeText={text =>
                    this.setState({...this.state, yourFullName: text})
                  }
                  value={this.state.yourFullName}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  disabled={this.state.isLoading}
                  onPress={this.onJoinAction}
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
                  {/* <Icon name={'mail'} style={{ color: 'white', fontSize: 22, marginRight: 6, marginLeft: 2 }} /> */}
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      alignSelf: 'center',
                      fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                    }}>
                    Join
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  maxWidth: CONSTANTS.WIDTH - 100,
                  alignSelf: 'center',
                  justifyContent: 'center',

                  marginTop: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                  }}>
                  By pressing "Join" you agree to our
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('TandC')}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                      fontWeight: 'bold',
                    }}>
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this.state.isLoading ? <OverlayLoading /> : null}
        </ImageBackground>
      </ScrollView>
    );
  }
}

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
