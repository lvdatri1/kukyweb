import Axios from 'axios';
import {Buffer} from 'buffer';
import {Icon} from 'native-base';
import React, {Component} from 'react';
import {
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from 'react-redux';
import RNFS from 'react-native-fs';
import {refreshPosts} from '../actions/postActions';
import {
  getUploadUrl,
  shareFullPost,
  uploadMediaToPeertal,
  uploadBigFileToS3,
} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {Text, LoadingSpinner} from '../components/CoreUIComponents';
import TagPeopleModal from './TagPeopleModal';
import SendMoneyPostModal from './SendMoneyPostModal';
import ProgressBar from './CoreUIComponents/ProgressBar';
import {
  getAddressFromLocation,
  getCurrentLocation,
} from '../actions/commonActions';
import ReactNativeImagePicker from 'react-native-image-picker';
import {PhotoEditorWithImage} from '../common/PhotoEditorHandler';

//@flow
class NewFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postContent: '',
      tagList: [],
      address: 'Here you are',
      isLoading: false,
      loadingPercent: {},
      photoList: [],
      isPublic: true,
      isIncognito: false,
      isLocation: true,
      tagPeopleModal: false,
      sendMoneyPostModal: false,
      payment: {
        coinAmount: 0,
        currency: 'USD',
        dollarAmount: 0,
      },
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleUploadPhoto = this.handleUploadPhoto.bind(this);
    this._renderPhotos = this._renderPhotos.bind(this);
    this.handleSharePost = this.handleSharePost.bind(this);
    this.handleCamera = this.handleCamera.bind(this);
    this._removePhoto = this._removePhoto.bind(this);
    this.updateTagList = this.updateTagList.bind(this);
    this.handleUploadVideo = this.handleUploadVideo.bind(this);
    this._onShow = this._onShow.bind(this);
  }

  toggleModal() {
    this.setState({modalVisible: !this.state.modalVisible});
  }
  updateTagList(list) {
    this.setState({tagList: list});
  }
  handleSharePost() {
    let currentLocation = {
      lon: this.props.user.longitude, //changed to lon not lng
      lat: this.props.user.latitude,
    };
    let postData = {
      content: this.state.postContent,
      medias: this.state.photoList.map(item => item.id),
      tags: this.state.tagList.map(item => item.id),
      isPublic: this.state.isPublic,
      isIncognito: this.state.isIncognito,
      location: this.state.isLocation ? currentLocation : null,
      payment: this.state.payment.coinAmount,
    };

    shareFullPost(
      this.props.user.accessToken,
      postData,
      res => {
        this.props.dispatch(refreshPosts(this.props.user.accessToken));
        this.setState({
          postContent: '',
          photoList: [],
          isPublic: true,
          isIncognito: false,
          tagList: [],
        });
        if (this.props.callback) this.props.callback();
      },
      CONSTANTS.DEFAULT_ERROR_CALL_BACK,
    );
    this.props.onClose();
  }

  /* handleCamera() {
    ImagePicker.openCamera({
      width: 800,
      height: 800,
      includeExif: true,
      compressImageQuality: 0.8,
      compressImageMaxHeight: 800,
      compressImageMaxWidth: 800,
      cropping: true,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
      includeBase64: true,
      cropperToolbarTitle: 'Edit Photo Before Uploading',
    })
      .then(image => {
        this.setState({isLoading: true});
        uploadMediaToPeertal(
          this.props.user.accessToken,
          `data:${image.mime};base64,` + image.data,
          'post',
          res => {
            let response = res.data;
            if (response.status === 200) {
              this.setState({
                photoList: this.state.photoList.concat(response.data),
                isLoading: false,
              });
            } else {
              alert(response.message);
            }
          },
          err => {
            // alert("error some where");
            this.setState({isLoading: false});
          },
        );
      })
      .catch(err => {});
      } */

  handleCamera() {
    const options = {
      noData: true,
    };
    ReactNativeImagePicker.launchCamera(options, response => {
      if (response.uri) {
        PhotoEditorWithImage(response.uri, result => {
          RNFS.readFile(result.image, 'base64').then(base64data => {
            this.setState({isLoading: true});
            uploadMediaToPeertal(
              this.props.user.accessToken,
              `data:${'image/jpeg'};base64,` + base64data,
              'post',
              res => {
                let response = res.data;
                if (response.status === 200) {
                  this.setState({
                    photoList: this.state.photoList.concat(response.data),
                    isLoading: false,
                  });
                } else {
                  alert(response.message);
                }
              },
              err => {
                console.log('error upload', err);
                alert('error some where');
                this.setState({isLoading: false});
              },
            );
          }),
            error => {
              console.log(error);
            };
        });
      }
    });
  }
  handleUploadVideo() {
    let mediaType = 'video';
    ImagePicker.openPicker({
      mediaType: mediaType,
      includeBase64: true,
    })
      .then(image => {
        this.setState({isLoading: true});

        uploadBigFileToS3(
          this.props.user.accessToken,
          image,
          res => {
            this.setState({
              photoList: this.state.photoList.concat({
                ...res.data.data,
                url: CONSTANTS.DEFAULT_VIDEO_ICON,
              }),
              isLoading: false,
            });
          },
          err => alert('upload video error' + err.message),
          progressEvent => this.setState({loadingPercent: progressEvent}),
        );
      })
      .catch(err => {
        // alert("wrong with" + err.message);
        this.setState({isLoading: false});
      });
  }
  handleUploadPhoto(mediaType = 'photo') {
    const options = {
      noData: true,
      mediaType: mediaType,
    };

    ReactNativeImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        PhotoEditorWithImage(response.uri, result => {
          RNFS.readFile(result.image, 'base64').then(base64data => {
            this.setState({isLoading: true});
            uploadMediaToPeertal(
              this.props.user.accessToken,
              `data:${'image/jpeg'};base64,` + base64data,
              'post',
              res => {
                let response = res.data;
                if (response.status === 200) {
                  this.setState({
                    photoList: this.state.photoList.concat(response.data),
                    isLoading: false,
                  });
                } else {
                  alert(response.message);
                }
              },
              err => {
                console.log('error upload', err);
                alert('error some where');
                this.setState({isLoading: false});
              },
              event => this.setState({loadingPercent: event}),
            );
          }),
            error => {
              console.log(error);
            };
        });
      }
    });
  }

  handleChangeContent(text) {
    this.setState({postContent: text});
  }

  _removePhoto(index) {
    var newPhoto = this.state.photoList;
    newPhoto.splice(index, 1);
    this.setState({photoList: newPhoto});
  }

  _renderPhotos() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginBottom: 5,
        }}>
        {this.state.photoList.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this._removePhoto(index);
              }}>
              <Image
                source={{uri: item.url}}
                style={{
                  height: 40,
                  width: 40,
                  marginHorizontal: 5,
                  borderRadius: 5,
                }}
              />
              <View>
                <Icon
                  name="ios-close-circle"
                  style={{
                    marginTop: -40,
                    marginLeft: 28,
                    color: 'red',
                    fontSize: 20,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  _onShow() {
    if (this.props.params) {
      this.setState({
        ...this.props.params,
      });
    }
    getCurrentLocation(position => {
      this.props.dispatch({
        type: 'UPDATE_LONG_LAT',
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
      });
      getAddressFromLocation(
        position.coords.latitude,
        position.coords.longitude,
        res => {
          this.setState({address: res.data.results[0].formatted_address});
        },
      );
    });
  }
  render() {
    const modalFooterHeight = 128;
    const avatar = this.state.isIncognito
      ? CONSTANTS.DEFAULT_AVATAR
      : this.props.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = this.state.isIncognito
      ? 'Incognito'
      : this.props.user.fullName;
    const timeAgo = 'now';
    const tagList = CONSTANTS.renderListPeople(
      this.state.tagList.map(item => item.fullName),
    );
    const locationAddress = this.state.isLocation
      ? this.state.address
      : 'your location is hidden';
    const postMoney =
      '$ ' +
      this.state.payment.dollarAmount +
      ' ' +
      this.state.payment.currency;
    const onClose = this.props.onClose;
    const enabled = this.props.enabled;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={enabled}
          onShow={this._onShow}>
          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 16,
            }}>
            <View
              style={{
                marginTop: CONSTANTS.SPARE_HEADER,
                flexDirection: 'row',
                height: 48,
                backgroundColor: 'white',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={onClose}>
                <Text style={{fontSize: 12, color: 'gray'}}>Cancel</Text>
              </TouchableOpacity>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                CREATE POST
              </Text>
              <TouchableOpacity
                onPress={this.handleSharePost}
                enabled={!this.state.isLoading}>
                <Text
                  style={{
                    fontSize: 12,
                    color: this.state.isLoading ? 'white' : CONSTANTS.MY_BLUE,
                  }}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: 'white',
                borderBottomColor: '#F3F4F4',
                shadowColor: 'blue',
              }}>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Image
                  source={{uri: avatar}}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 48 / 2,
                    backgroundColor: 'gray',
                    alignSelf: 'flex-start',
                  }}
                />
                <View
                  style={{
                    width: CONSTANTS.WIDTH - 86,
                    paddingLeft: 12,
                    backgroundColor: 'white',
                    paddingTop: 6,
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    {fullName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '200',
                      fontSize: 12,
                      color: '#BCBEC0',
                    }}>
                    {timeAgo}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 5,
                  // borderLeftWidth: 1,
                  marginLeft: 36,
                  borderStyle: 'dashed',
                  borderColor: 'gray',
                  borderWidth: 1,
                  // borderLeftColor: 'gray', //react native does not support
                  // style border on just a line
                  minHeight: 40,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    minHeight: 43,
                    marginRight: -1,
                    marginBottom: -1,
                    marginTop: -1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 12,
                      marginTop: 5,
                    }}>
                    <Image
                      source={require('../assets/xd/Icons/users.png')}
                      style={{width: 14, height: 14}}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      {tagList}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 12,
                      marginTop: 5,
                    }}>
                    <Image
                      source={require('../assets/xd/Icons/post_location.png')}
                      style={{width: 14, height: 14}}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      {locationAddress}
                    </Text>
                  </View>
                  {/* Hide wallet and money transfer feature for ios */}
                  {Platform.OS === 'ios' ? null : (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 12,
                        marginTop: 5,
                      }}>
                      <Image
                        source={require('../assets/xd/Icons/post_money.png')}
                        style={{width: 14, height: 14}}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          textAlignVertical: 'center',
                          marginLeft: 10,
                        }}>
                        {postMoney}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  backgroundColor: CONSTANTS.MY_GRAYBG,
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                <TextInput
                  multiline
                  value={this.state.postContent}
                  onChangeText={text => this.setState({postContent: text})}
                  placeholder="post your content here"
                  style={{
                    minHeight: 40,
                    margin: 10,
                    maxHeight: 60,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                  }}
                />
                {this._renderPhotos()}
              </View>
              {/* {this.state.isLoading ? <LoadingSpinner /> : null} */}
              {this.state.isLoading ? (
                <ProgressBar
                  data={
                    this.state.loadingPercent.total
                      ? (
                          (this.state.loadingPercent.loaded * 100) /
                          this.state.loadingPercent.total
                        ).toFixed(0)
                      : 5
                  }
                />
              ) : null}
            </View>
            <View style={{backgroundColor: 'white', height: modalFooterHeight}}>
              {/* Hide wallet and money transfer feature for ios */}
              {Platform.OS === 'ios' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 16,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({tagPeopleModal: true})}
                    style={{
                      borderColor: 'gray',
                      flexDirection: 'row',
                      borderWidth: 1,
                      width: '30%',
                      height: 34,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Icon
                      name="tag"
                      type="FontAwesome5"
                      style={{
                        color: 'gray',
                        fontSize: 14,
                        marginRight: 5,
                      }}
                    />
                    <Text style={{fontSize: 12, color: 'gray'}}>
                      Tag Friends
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderColor: 'gray',
                      flexDirection: 'row',
                      borderWidth: 1,
                      width: '30%',
                      height: 34,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Icon
                      name="lock"
                      type="FontAwesome5"
                      style={{
                        color: 'gray',
                        fontSize: 14,
                        marginRight: 5,
                      }}
                    />
                    <Text style={{fontSize: 12, color: 'gray'}}>Only me</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 16,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({tagPeopleModal: true})}
                    style={{
                      borderColor: 'gray',
                      flexDirection: 'row',
                      borderWidth: 1,
                      width: '30%',
                      height: 34,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Icon
                      name="tag"
                      type="FontAwesome5"
                      style={{
                        color: 'gray',
                        fontSize: 14,
                        marginRight: 5,
                      }}
                    />
                    <Text style={{fontSize: 12, color: 'gray'}}>
                      Tag Friends
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.setState({sendMoneyPostModal: true})}
                    style={{
                      borderColor: 'gray',
                      flexDirection: 'row',
                      borderWidth: 1,
                      width: '30%',
                      height: 34,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Icon
                      name="wallet"
                      type="FontAwesome5"
                      style={{
                        color: 'gray',
                        fontSize: 14,
                        marginRight: 5,
                      }}
                    />
                    <Text style={{fontSize: 12, color: 'gray'}}>
                      Send Money
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderColor: 'gray',
                      flexDirection: 'row',
                      borderWidth: 1,
                      width: '30%',
                      height: 34,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Icon
                      name="lock"
                      type="FontAwesome5"
                      style={{
                        color: 'gray',
                        fontSize: 14,
                        marginRight: 5,
                      }}
                    />
                    <Text style={{fontSize: 12, color: 'gray'}}>Only me</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <TouchableOpacity onPress={this.handleCamera}>
                  <Image source={require('../assets/xd/Icons/camera.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleUploadPhoto('any')}>
                  <Image source={require('../assets/xd/Icons/photo.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleUploadVideo}>
                  <Image
                    source={require('../assets/xd/Icons/play_button.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isLocation: !this.state.isLocation});
                  }}>
                  <Image
                    source={require('../assets/xd/Icons/tag_button.png')}
                    style={{opacity: this.state.isLocation ? 1 : 0.2}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({isIncognito: !this.state.isIncognito});
                  }}>
                  <Image
                    source={require('../assets/xd/Icons/incognito_button.png')}
                    style={{opacity: this.state.isIncognito ? 1 : 0.2}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TagPeopleModal
            enabled={this.state.tagPeopleModal}
            onClose={() => this.setState({tagPeopleModal: false})}
            callback={this.updateTagList}
            peopleList={this.props.peopleList}
          />
          <SendMoneyPostModal
            enabled={this.state.sendMoneyPostModal}
            onClose={() => this.setState({sendMoneyPostModal: false})}
            callback={(coin, dollar, currency) => {
              const value = {
                coinAmount: coin,
                currency: currency,
                dollarAmount: dollar,
              };
              this.setState({payment: value});
            }}
          />
        </Modal>
      </View>
    );
  }
}
const MapStateToProps = store => ({user: store.user});
const FooterContainer = connect(MapStateToProps)(NewFooter);
export default FooterContainer;
