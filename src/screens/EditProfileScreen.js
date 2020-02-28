import {Icon} from 'native-base';
import React, {Component} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {
  getMySettings,
  updateMyAvatar,
  updateMyBackground,
  updateMySettings,
} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {
  DropdownSelect,
  GenderSelect,
  OverlayLoading,
  StatusSelect,
} from '../components/CoreUIComponents';
import SettingsObject from '../models/SettingsObject';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    getMySettings(this.props.user.accessToken, this.props.user.userId, res => {
      // const dataProfile = res.data.data.profile;
      let settings;
      res == null
        ? (settings = new SettingsObject())
        : (settings = res.data.data);
      settings.accountType = settings.accountType || 'individual';
      settings.language = settings.language || 'english';
      settings.country = settings.country || 'australia';
      settings.gender = settings.gender || 'male';
      settings.maritalStatus = settings.maritalStatus || 'any';
      console.log('after settings', settings);
      this.state = preState => ({
        ...preState,
        ...settings,
        defaultTab: 'Posts',
        isLoading: false,
      });
    });
    this.handleTouchTab = this.handleTouchTab.bind(this);
    this.loadingData = this.loadingData.bind(this);
    this._updateData = this._updateData.bind(this);
    this.onCameraButtonPress = this.onCameraButtonPress.bind(this);
    this.handleUpdateBackground = this.handleUpdateBackground.bind(this);
  }
  handleUpdateBackground = () => {
    // alert('hello')
    ImagePicker.openPicker({
      width: 800,
      height: 400,
      cropping: true,
      cropperChooseText: 'Choose',
      cropperToolbarTitle: 'Crop your background here',
      includeExif: true,
      mediaType: 'any',
      forceJpg: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 400,
      includeBase64: true,
    }).then(image => {
      // console.log("image base64:", image.data); //image.path ->uri
      this.setState({
        backgroundUrl: image.path,
      });
      updateMyBackground(
        this.props.user.accessToken,
        this.props.user.userId,
        image.data,
        res => {
          Alert.alert('Message', 'Your background has been updated');
          this.setState({
            backgroundUrl: res.data.data.url,
          });
        },
      );

      // this.setState({ avatarBase64: "data:image/png;base64, " + image.data });
    });
  };
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
      console.log('image base64:', image); //image.path ->uri
      this.setState({
        avatarUrl: image.path,
      });
      updateMyAvatar(
        this.props.user.accessToken,
        this.props.user.userId,
        image.data,
        res => {
          Alert.alert('Message', 'Your avatar has been updated');
          console.log('update avatar', res);
          this.setState({
            avatarUrl: res.data.data.url,
          });
        },
      );

      // this.setState({ avatarBase64: "data:image/png;base64, " + image.data });
    });
  };
  handleTouchTab(name) {
    this.setState({defaultTab: name});
  }
  _updateData() {
    let settings = new SettingsObject();
    settings = {...settings, ...this.state};
    // console.log("settings here", settings);
    updateMySettings(
      this.props.user.accessToken,
      this.props.user.userId,
      settings,
      res => {
        // alert("done");
        const settings = res.data.data;
        // console.log("after settings", settings);
        this.props.dispatch({
          type: 'UPDATE_MY_SETTINGS',
          data: {
            ...settings,
          },
        });
        this.setState(preState => ({
          ...preState,
          ...settings,
          isLoading: false,
        }));

        this.props.navigation.navigate('Discover');
      },
    );
  }
  loadingData() {
    this.setState({isLoading: true});
    getMySettings(this.props.user.accessToken, this.props.user.userId, res => {
      // const dataProfile = res.data.data.profile;
      let settings = res.data.data;
      settings.accountType = settings.accountType || 'individual';
      settings.language = settings.language || 'english';
      settings.country = settings.country || 'australia';
      settings.gender = settings.gender || 'male';
      settings.maritalStatus = settings.maritalStatus || 'any';
      console.log('after settings', settings);
      this.setState(preState => ({
        ...preState,
        ...settings,
        isLoading: false,
      }));
    });
  }
  componentDidMount() {
    // this.loadingData();
  }

  render() {
    const avatarUrl = this.state.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const backgroundUrl = this.state.backgroundUrl || CONSTANTS.RANDOM_IMAGE;
    return (
      <View style={{height: '100%', width: '100%'}}>
        <ScrollView style={{flexDirection: 'column', height: '100%'}}>
          <NavigationEvents
            onWillFocus={() => {
              this.loadingData();
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: CONSTANTS.SPARE_HEADER,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}>
              <Icon
                name="arrowleft"
                type="AntDesign"
                style={{marginLeft: 15, color: 'black'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              EDIT PROFILE
            </Text>
            <TouchableOpacity onPress={this._updateData}>
              <Text style={{marginRight: 15, color: CONSTANTS.MY_BLUE}}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 58,
              backgroundColor: CONSTANTS.MY_GRAYBG,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 17,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              {' '}
              Overview
            </Text>
          </View>
          <ImageBackground
            style={{
              width: '100%',
              height: 175,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              flexDirection: 'row',
              backgroundColor: CONSTANTS.MY_GRAYBG,
            }}
            source={{uri: backgroundUrl}}>
            <TouchableOpacity
              TouchableOpacity
              onPress={this.handleUpdateBackground}>
              <Icon
                name="camera"
                style={{
                  color: 'white',
                  marginTop: 10,
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          </ImageBackground>
          <TouchableOpacity onPress={this.onCameraButtonPress}>
            <Image
              source={{uri: avatarUrl}}
              style={{
                alignSelf: 'center',
                height: 168,
                width: 168,
                marginTop: -84,
                borderRadius: 84,
                borderWidth: 5,
                borderColor: 'white',
                backgroundColor: CONSTANTS.MY_GRAYBG,
              }}
            />
            <Icon
              name="camera"
              style={{
                alignSelf: 'center',
                color: 'white',
                marginTop: -94,
              }}
            />
          </TouchableOpacity>
          <View style={{marginTop: 74, marginHorizontal: 15}}>
            <Text>Name</Text>
            <View
              style={{
                borderColor: CONSTANTS.MY_BLACK_BORDER,
                borderRadius: 5,
                marginTop: 5,
                borderWidth: 1,
              }}>
              <TextInput
                value={this.state.fullName}
                onChangeText={txt => this.setState({fullName: txt})}
                textContentType="givenName"
                style={{
                  margin: 5,
                  fontSize: 18,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                }}
              />
            </View>
          </View>
          <View style={{margin: 15, marginBottom: 38}}>
            <Text>About</Text>
            <View
              style={{
                borderColor: CONSTANTS.MY_BLACK_BORDER,
                borderRadius: 5,
                marginTop: 5,
                borderWidth: 1,
              }}>
              <TextInput
                value={this.state.about}
                onChangeText={txt => this.setState({introduction: txt})}
                textContentType="givenName"
                multiline={true}
                style={{
                  margin: 5,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                  fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                  minHeight: 50,
                }}
              />
            </View>
          </View>
          <View style={{marginHorizontal: 15}}>
            <Text
              style={{
                fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL_2,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              Detail Information
            </Text>
          </View>
          <GenderSelect
            titleFontSize={{fontSize: 14}}
            value={this.state.gender}
            onChangeValue={gender => this.setState({gender: gender})}
          />
          <StatusSelect
            value={this.state.maritalStatus}
            onChangeValue={value => this.setState({maritalStatus: value})}
          />
          <View style={{marginHorizontal: 15}}>
            <Text style={{marginBottom: 15, textTransform: 'capitalize'}}>
              Country
            </Text>
            <DropdownSelect
              value={this.state.country}
              data={CONSTANTS.COUNTRY_LIST.map(item => {
                return {value: item.name, label: item.name};
              })}
              onChangeValue={value => this.setState({country: value})}
            />
          </View>
          <View style={{marginHorizontal: 15, marginTop: 15}}>
            <Text style={{marginBottom: 15}}>Language</Text>
            <DropdownSelect
              value={this.state.language}
              data={CONSTANTS.COUNTRY_LIST.map(item => {
                return {value: item.language, label: item.language};
              })}
              onChangeValue={value => this.setState({language: value})}
            />
          </View>
          <View style={{marginHorizontal: 15, marginTop: 15}}>
            <Text style={{marginBottom: 15}}>Account Type</Text>
            <DropdownSelect
              value={this.state.accountType}
              data={[
                {value: 'individual', label: 'individual'},
                {value: 'business', label: 'business'},
              ]}
              onChangeValue={value => this.setState({accountType: value})}
            />
          </View>
          <View
            style={{
              marginVertical: 30,
              borderColor: CONSTANTS.MY_GRAYBG,
              borderTopWidth: 1,
            }}
          />
          <View
            style={{
              marginHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '75%'}}>
              <Text>ALLOW PEOPLE TO SEE ME</Text>
              <Text>Everyone can see your information and what you post</Text>
            </View>
            <Switch
              trackColor={{false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE}}
              // thumbColor={CONSTANTS.MY_BLUE}
              value={this.state.allowPeopleToSeeMe}
              onValueChange={value =>
                this.setState({
                  allowPeopleToSeeMe: value,
                })
              }
            />
          </View>
          <View
            style={{
              marginTop: 15,
              marginHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '75%'}}>
              <Text>OVER 18</Text>
            </View>
            <Switch
              trackColor={{false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE}}
              // thumbColor={CONSTANTS.MY_BLUE}
              value={this.state.over18 == 1}
              onValueChange={value =>
                this.setState({
                  over18: value,
                })
              }
            />
          </View>
          <View
            style={{
              marginTop: 15,
              marginHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: '75%'}}>
              <Text>Show me adult content</Text>
            </View>
            <Switch
              trackColor={{false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE}}
              // thumbColor={CONSTANTS.MY_BLUE}
              value={this.state.subscribeToAdultContent == 1}
              onValueChange={value =>
                this.setState({
                  subscribeToAdultContent: value,
                })
              }
            />
          </View>
          <View style={{height: 320}} />
          {/* //render content under tab here */}
        </ScrollView>
        {this.state.isLoading ? <OverlayLoading /> : null}
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user,
});
const EditProfileScreenContainer = connect(mapStateToProps)(EditProfileScreen);
export default EditProfileScreenContainer;
