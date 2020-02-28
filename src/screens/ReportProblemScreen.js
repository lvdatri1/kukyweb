import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {
  getUploadUrl,
  shareFullPost,
  uploadMediaToPeertal,
  uploadBigFileToS3,
} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import {Icon} from 'native-base';
import {getPageInfo} from '../actions/commonActions';
import {
  OverlayLoading,
  Text,
  DropdownSelect,
  RoundButton,
} from '../components/CoreUIComponents';
import ContactObject from '../models/ContactObject';
import SuccessMessageObject from '../models/SuccessMessageObject';
import {reportAProblem} from '../actions/commonActions';

class ReportProblemScreen extends Component {
  constructor(props) {
    super(props);
    const temp = new ContactObject();
    this.state = {
      pageData: null,
      isLoading: false,
      ...temp,
      loadingPercent: 0,
    };
    this._renderMedia = this._renderMedia.bind(this);
    this._handleUploadPhoto = this._handleUploadPhoto.bind(this);
    this._submitProblem = this._submitProblem.bind(this);
  }
  _submitProblem() {
    const contactData = {
      ...this.state,
      media: this.state.media.map(item => item.id),
    };
    this.setState({isLoading: true});
    reportAProblem(
      this.props.user.accessToken,
      contactData,
      res => {
        const mess = new SuccessMessageObject(
          'Report',
          undefined,
          '',
          '',
          '',
          '',
          'Thank you for your feedback. We will review your problems and revert to you ASAP.',
        );
        this.setState({isLoading: false});
        this.props.navigation.navigate('SuccessAction', {data: mess});
      },
      err => {
        this.setState({isLoading: false});
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      },
    );
  }

  _renderMedia() {
    return this.state.media.map(item => (
      <Image source={{uri: item.url}} style={styles.screenshot} key={item.id} />
    ));
  }
  _handleUploadPhoto(mediaType = 'photo') {
    ImagePicker.openPicker({
      width: 800,
      height: 800,
      includeExif: true,
      compressImageQuality: 0.8,
      compressImageMaxHeight: 800,
      compressImageMaxWidth: 800,
      cropping: true, //this should be removed if want to use videos
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
      // mediaType: mediaType,
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
                media: this.state.media.concat(response.data),
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
      })
      .catch(err => {});
  }
  componentDidMount() {}
  render() {
    const title = 'REPORT A PROBLEM';
    const pageName1 = 'Report';
    const pageName2 = 'A Problem';
    const listIssues = [
      'send money',
      'install app',
      'update app',
      'posting',
      'top up money',
      'cash out',
      'others',
    ];
    const summary =
      "We love feedback. That's how we know we're doing right or wrong. Feel free to tell us what you like what you dislike";
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

        <ScrollView style={{marginHorizontal: 15, marginTop: 20}}>
          <ImageBackground
            style={{
              width: '100%',
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
            source={require('../assets/xd/header/contact_header.png')}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                alignSelf: 'center',
                color: 'white',
                fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
              }}>
              {pageName1}
            </Text>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                alignSelf: 'center',
                color: 'white',
                fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
              }}>
              {pageName2}
            </Text>
          </ImageBackground>
          <Text>{summary}</Text>
          <View>
            <View style={styles.lineContainer}>
              <Icon
                name="email"
                type="MaterialCommunityIcons"
                style={{...styles.iconStyle}}
              />
              <Text style={{...styles.textCaption}}>Your Email</Text>
            </View>
            <TextInput
              style={{...styles.inputContainer}}
              placeholder={'Enter your email'}
              value={this.state.email}
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <View>
            <View style={styles.lineContainer}>
              <Icon
                name="phone"
                type="MaterialCommunityIcons"
                style={{...styles.iconStyle}}
              />
              <Text style={{...styles.textCaption}}>Your Phone</Text>
            </View>
            <TextInput
              style={{...styles.inputContainer}}
              placeholder={'Enter your phone number'}
              value={this.state.phone}
              onChangeText={value => this.setState({phone: value})}
            />
          </View>
          <View>
            <View style={styles.lineContainer}>
              <Icon
                name="bug-report"
                type="MaterialIcons"
                style={{...styles.iconStyle}}
              />
              <Text style={{...styles.textCaption}}>Category</Text>
            </View>

            <DropdownSelect
              data={listIssues.map(item => ({label: item, value: item}))}
              value={this.state.topic}
              onChangeValue={text => this.setState({problem: text})}
              style={styles.dropdown}
            />
          </View>
          <View>
            <View style={styles.lineContainer}>
              <Icon
                name="message"
                type="MaterialCommunityIcons"
                style={{...styles.iconStyle}}
              />
              <Text style={{...styles.textCaption}}>What is in your mind?</Text>
            </View>
            <TextInput
              style={{...styles.inputWithMultiLinesContainer}}
              placeholder={'Enter your problem'}
              value={this.state.description}
              multiline={true}
              onChangeText={value => this.setState({description: value})}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.lineContainer}
              onPress={this._handleUploadPhoto}>
              <Icon
                name="camera"
                type="MaterialIcons"
                style={{...styles.iconStyle}}
              />
              <Text style={{...styles.textCaption}}>Attached screenshots:</Text>
              {this._renderMedia()}
            </TouchableOpacity>
          </View>
          <RoundButton
            text="Submit"
            style={{marginTop: 20}}
            onPress={this._submitProblem}
          />
          <View style={{height: 100}} />
          {this.state.isLoading ? <OverlayLoading /> : null}
        </ScrollView>
      </View>
    );
  }
}

const MapStateToProps = store => ({user: store.user});
export default ReportProblemContainer = connect(MapStateToProps)(
  ReportProblemScreen,
);

const styles = {
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  textCaption: {
    marginLeft: 10,
  },
  inputContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: CONSTANTS.MY_GREY,
    borderRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  inputWithMultiLinesContainer: {
    minHeight: 100,
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    borderColor: CONSTANTS.MY_GREY,
    borderRadius: 10,
  },
  iconStyle: {
    fontSize: 18,
  },
  lineHalfContainer: {
    flexDirection: 'row',
    width: 160 * CONSTANTS.WIDTH_RATIO,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  dropdown: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  image: {height: 12, width: 42},
  screenshot: {height: 20, width: 20, marginLeft: 10},
};
