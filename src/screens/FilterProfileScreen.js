import {Icon} from 'native-base';
import React, {Component} from 'react';
import Carousel from 'react-native-snap-carousel';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Switch,
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
  Text,
} from '../components/CoreUIComponents';
import SettingsObject from '../models/SettingsObject';
import FilterFriendsObject from '../models/FilterFriendsSetting';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import LinearGradient from 'react-native-linear-gradient';

class FilterProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultTab: 'Posts',
      suggestedGoogleAddress: '',
      isLoading: false,
      selectedCharacter: -1,
      selectingCharacter: 0,
      gender: 'any',
      maritalStatus: 'any',
      skillValue: '',
      skillList: ['aa', 'bbb'],
      characterArray: getPersonalityData(),
    };
    this.handleTouchTab = this.handleTouchTab.bind(this);
    this.loadingData = this.loadingData.bind(this);
    this.onCameraButtonPress = this.onCameraButtonPress.bind(this);
    this.handleUpdateBackground = this.handleUpdateBackground.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderSkillTags = this._renderSkillTags.bind(this);
    this._addSkillAction = this._addSkillAction.bind(this);
    this._applyAction = this._applyAction.bind(this);
    this._selectSuggestedAddress = this._selectSuggestedAddress.bind(this);
  }
  _selectSuggestedAddress(data, details = null) {
    console.log(details.formatted_address);
    this.setState({suggestedGoogleAddress: details.formatted_address});
  }
  _applyAction() {
    let tempSetting = {
      ...new FilterFriendsObject(),
      ...this.state,
      skills: this.state.skillList,
    };
    this.props.dispatch({
      type: 'UPDATE_FILTER_FRIENDS_SETTINGS',
      data: tempSetting,
    });
    this.props.navigation.goBack();
  }
  _addSkillAction() {
    const temp = this.state.skillValue;
    if (this.state.skillList.indexOf(temp) === -1 && temp != '')
      this.setState({
        skillList: this.state.skillList.concat(temp),
        skillValue: '',
      });
    else this.setState({skillValue: ''});
  }
  _renderSkillTags() {
    const self = this;
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 15}}>
        {this.state.skillList.map((item, index) => (
          <View
            style={{
              backgroundColor: CONSTANTS.MY_GRAYBG,
              height: 50,
              borderRadius: 25,
              margin: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            key={index}>
            <Text style={{fontSize: 14, marginHorizontal: 15}}>{item} </Text>
          </View>
        ))}
        {this.state.skillList.length > 0 ? (
          <TouchableOpacity
            style={{
              backgroundColor: CONSTANTS.MY_GRAYBG,
              height: 50,
              borderRadius: 25,
              margin: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => self.setState({skillList: []})}>
            <Text style={{fontSize: 14, marginHorizontal: 15, color: 'red'}}>
              Clear all{' '}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  _renderItem({item, index}) {
    const self = this;
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 15,
          paddingVertical: 20,
        }}>
        <View
          style={{elevation: CONSTANTS.OS === 'android' ? 50 : 0, zIndex: 3}}>
          <Image
            source={item.app_image_src}
            style={{
              width: 180 * CONSTANTS.WIDTH_RATIO,
              height: 180 * CONSTANTS.WIDTH_RATIO,
            }}></Image>
        </View>
        <View
          style={{
            elevation: CONSTANTS.OS === 'android' ? 50 : 0,
            zIndex: 4,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor:
              self.state.selectedCharacter !== index
                ? '#DEDEDE'
                : CONSTANTS.MY_PINK,
            marginTop: -75,
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="check"
            type="FontAwesome"
            style={{
              color:
                self.state.selectedCharacter == index ? 'white' : '#DEDEDE',
              fontSize: 14,
            }}></Icon>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            ...CONSTANTS.MY_SHADOW_STYLE,
            alignItems: 'center',
            marginHorizontal: 15,
            borderRadius: 10,
            elevation: CONSTANTS.OS === 'android' ? 50 : 0,
            marginTop: -15,
            zIndex: 1,
            paddingHorizontal: 15,
            width: CONSTANTS.OS === 'android' ? null : 256,
          }}>
          <Text
            style={{
              marginTop: 75,
              fontSize: 18,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: CONSTANTS.MY_BLUE,
              marginHorizontal: 15,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginHorizontal: 15,
              marginVertical: 20,
              textAlign: 'center',
            }}>
            {item.summary}
          </Text>

          <TouchableOpacity
            onPress={() => {
              self.setState({selectedCharacter: index});
            }}
            style={{
              width: 180,
              height: 50,
              borderRadius: 25,
              backgroundColor: CONSTANTS.MY_BLUE,
              marginBottom: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

  loadingData() {
    const globalFilterSettings =
      this.props.user.filterFriends || new FilterFriendsObject();
    this.setState({
      skillList: globalFilterSettings.skills,
      gender: globalFilterSettings.gender,
      maritalStatus: globalFilterSettings.maritalStatus,
      selectedCharacter: globalFilterSettings.selectedCharacter,
    });
  }
  componentDidMount() {
    // this.loadingData();
  }

  render() {
    const backgroundRes = require('../assets/xd/background/map_bg.png');

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
              height: 48,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                  marginLeft: 15,
                  color: CONSTANTS.MY_GREY,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              FILTER
            </Text>
            <TouchableOpacity onPress={this._applyAction}>
              <Text
                style={{
                  marginRight: 15,
                  color: CONSTANTS.MY_BLUE,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#EBEAEA', '#FFFFFF']}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: 58,
            }}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 13,
                color: 'black',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              {' '}
              Location
            </Text>
          </LinearGradient>

          <ImageBackground
            style={{
              width: '100%',
              height: 215,
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 15,
              backgroundColor: CONSTANTS.MY_GRAYBG,
            }}
            source={backgroundRes}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 25,
                marginHorizontal: 15,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <GooglePlacesAutocomplete
                placeholder="Enter Location"
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: CONSTANTS.GOOGLE_API_KEY,
                  language: 'en', // language of the results
                  // types: "(cities)" // default: 'geocode'
                }}
                currentLocation={true}
                currentLocationLabel="Current location"
                minLength={2}
                onPress={this._selectSuggestedAddress}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                listViewDisplayed="auto"
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                  },
                  listView: {
                    backgroundColor: 'white',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                currentLocation={false}
              />
            </View>
          </ImageBackground>
          <StatusSelect
            titleFontSize={{fontSize: 18}}
            initVal={true}
            value={this.state.maritalStatus}
            onChangeValue={value => this.setState({maritalStatus: value})}
          />

          <View>
            <Text style={styles.title}>Skills</Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                marginHorizontal: 15,
              }}>
              <TextInput
                style={{
                  width: CONSTANTS.WIDTH - 100 - 30,
                  backgroundColor: CONSTANTS.MY_GRAYBG,
                  fontSize: 14,
                  color: CONSTANTS.MY_GREY,
                  height: 40,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  paddingLeft: 15,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                }}
                value={this.state.skillValue}
                placeholder="Add strengths"
                onChangeText={value => this.setState({skillValue: value})}
              />
              <TouchableOpacity
                onPress={this._addSkillAction}
                style={{
                  backgroundColor: CONSTANTS.MY_BLUE,
                  width: 100,
                  padding: 5,
                  height: 40,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  Add skill{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this._renderSkillTags()}
          <GenderSelect
            titleFontSize={{fontSize: 18}}
            initVal={true}
            value={this.state.gender}
            onChangeValue={gender => this.setState({gender: gender})}
          />
          <Text style={styles.title}>Personality</Text>

          <Carousel
            data={this.state.characterArray}
            renderItem={this._renderItem}
            sliderWidth={CONSTANTS.WIDTH}
            itemWidth={CONSTANTS.WIDTH - 130}
            onSnapToItem={slideIndex =>
              this.setState({selectingCharacter: slideIndex})
            }
          />

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
const FilterProfileContainer = connect(mapStateToProps)(FilterProfileScreen);
export default FilterProfileContainer;

const styles = {
  title: {
    marginVertical: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: 'black',
  },
};
const getPersonalityData = (gender = 'man') => {
  let $personalityData = [];
  $personalityData.push({
    code: '',
    name: 'None',
    summary: 'Unselected...',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: require('../assets/character/man-Logistician.png'),
  });
  $personalityData.push({
    code: 'istj',
    name: 'Logistician',
    summary:
      'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: require('../assets/character/man-Logistician.png'),
  });
  $personalityData.push({
    code: 'istp',
    name: 'Virtuoso',
    summary: 'Bold and practical experimenters, masters of all kinds of tools.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istp.png',
    app_image_src: require('../assets/character/man-Virtuoso.png'),
  });
  $personalityData.push({
    code: 'isfj',
    name: 'Defender',
    summary:
      'Very dedicated and warm protectors, always ready to defend their loved ones.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/isfj.png',
    app_image_src: require('../assets/character/man-Defender.png'),
  });
  $personalityData.push({
    code: 'isfp',
    name: 'Adventurer',
    summary:
      'Flexible and charming artists, always ready to explore and experience something new.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/isfp.png',
    app_image_src: require('../assets/character/man-Adventurer.png'),
  });
  $personalityData.push({
    code: 'intj',
    name: 'Architect',
    summary:
      'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/intj.png',
    app_image_src: require('../assets/character/man-Architect.png'),
  });
  $personalityData.push({
    code: 'intp',
    name: 'Logician',
    summary: 'Innovative inventors with an unquenchable thirst for knowledge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/intp.png',
    app_image_src: require('../assets/character/man-Logician.png'),
  });
  $personalityData.push({
    code: 'infj',
    name: 'Advocate',
    summary: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/infj.png',
    app_image_src: require('../assets/character/man-Advocate.png'),
  });
  $personalityData.push({
    code: 'infp',
    name: 'Mediator',
    summary:
      'Poetic, kind and altruistic people, always eager to help a good cause.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/infp.png',
    app_image_src: require('../assets/character/man-Mediator.png'),
  });
  $personalityData.push({
    code: 'estj',
    name: 'Executive',
    summary:
      'Excellent administrators, unsurpassed at managing things – or people.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/estj.png',
    app_image_src: require('../assets/character/man-Executive.png'),
  });
  $personalityData.push({
    code: 'estp',
    name: 'Entrepreneur',
    summary:
      'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/estp.png',
    app_image_src: require('../assets/character/man-Entrepreneur.png'),
  });
  $personalityData.push({
    code: 'esfj',
    name: 'Consul',
    summary:
      'Extraordinarily caring, social and popular people, always eager to help.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/esfj.png',
    app_image_src: require('../assets/character/man-Consul.png'),
  });
  $personalityData.push({
    code: 'esfp',
    name: 'Entertainer',
    summary:
      'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/esfp.png',
    app_image_src: require('../assets/character/man-Entertainer.png'),
  });
  $personalityData.push({
    code: 'entj',
    name: 'Commander',
    summary:
      'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/entj.png',
    app_image_src: require('../assets/character/man-Commander.png'),
  });
  $personalityData.push({
    code: 'entp',
    name: 'Debater',
    summary:
      'Smart and curious thinkers who cannot resist an intellectual challenge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/entp.png',
    app_image_src: require('../assets/character/man-Debater.png'),
  });
  $personalityData.push({
    code: 'enfj',
    name: 'Protagonist',
    summary:
      'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/enfj.png',
    app_image_src: require('../assets/character/man-Protagonist.png'),
  });
  $personalityData.push({
    code: 'enfp',
    name: 'Campaigner',
    summary:
      'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/enfp.png',
    app_image_src: require('../assets/character/man-Campaigner.png'),
  });
  return $personalityData;
};
