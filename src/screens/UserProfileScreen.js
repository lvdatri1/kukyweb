import {Icon} from 'native-base';
import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import {connect} from 'react-redux';
import {getUserProfile} from '../actions/peopleActions';
import {getPostsInProfile} from '../actions/postActions';
import {reportToPerson, blockToPerson} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';
import CharacterGroup from '../components/CharacterGroup';
import {LoadingSpinner, Text} from '../components/CoreUIComponents';
import CreatePostModal from '../components/CreatePostModal';
import PersonRowItem from '../components/PersonRowItem';
import PostItem from '../components/PostItem';
import ScanQRCodeModal from '../components/ScanQRCodeModal';
import SkillListGroup from '../components/SkillListGroup';
import UserProfileObject from '../models/UserProfileObject';

class UserProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultTab: 'About',
      isLoading: false,
      posts: [],
      userId: 1,
      userData: new UserProfileObject(),
      isScanQRModal: false,
      createPostModal: false,
      isOwner: false,
    };
    this.handleTouchTab = this.handleTouchTab.bind(this);
    this.handleLoadingData = this.handleLoadingData.bind(this);
    this._renderAbout = this._renderAbout.bind(this);
    this._renderNetwork = this._renderNetwork.bind(this);
    this._renderPosts = this._renderPosts.bind(this);
    this.handleLoadingPosts = this.handleLoadingPosts.bind(this);
    this._handleReport = this._handleReport.bind(this);
    this._handleSkillReport = this._handleSkillReport.bind(this);
  }
  _handleReport() {
    reportToPerson(
      this.props.user.accessToken,
      {id: this.state.userData.id, type: 'USER', type: 'report'},
      res => {
        alert('Reported successfully');
      },
      err => {
        alert('Error when reporting person');
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      },
    );
  }
  _handleSkillReport() {
    reportToPerson(
      this.props.user.accessToken,
      {id: this.state.userData.id, type: 'USER', type: 'nsfw'},
      res => {
        alert(
          `${this.state.userData.fullName}'s skill has been successfully reported.`,
        );
      },
      err => {
        alert('Error when reporting skill');
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      },
    );
  }
  _handleBlock() {
    blockToPerson(
      this.props.user.accessToken,
      {id: this.state.userData.id, type: 'USER', type: 'block'},
      res => {
        alert('Blocked successfully');
      },
      err => {
        alert('Error when reporting person');
        CONSTANTS.DEFAULT_ERROR_CALL_BACK(err);
      },
    );
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  handleTouchTab(name) {
    this.setState({defaultTab: name});
    if (name == 'Posts') this.handleLoadingPosts();
  }
  handleLoadingPosts() {
    this.setState({isLoading: true});
    getPostsInProfile(
      this.props.user.accessToken,
      20,
      0,
      this.state.userId,
      res => {
        this.setState({posts: res.data.data.posts, isLoading: false});
        console.log('posts are here', this.state.posts);
      },
      err => {
        alert('no posts on this users', err.message);
        this.setState({isLoading: false});
      },
    );
  }
  handleLoadingData() {
    const userId =
      this.props.navigation.getParam('userId') || this.props.user.userId;
    if (userId == this.props.user.userId) this.setState({isOwner: true});
    this.setState({isLoading: true, userId: userId, defaultTab: 'About'});
    getUserProfile(this.props.user.accessToken, userId, res => {
      this.setState(preState => {
        var newData = res.data.data.user_data;
        return {...preState, isLoading: false, userData: newData};
      });
    });
  }
  componentDidMount() {
    // alert("mounted");
    // this.handleLoadingData();//call in navigation event
  }
  _renderNetwork() {
    if (this.state.isLoading) return <LoadingSpinner />;

    let friendsList = this.state.userData ? this.state.userData.friends : [];
    if (friendsList.length == 0)
      return (
        <Text style={{alignSelf: 'center', margin: 15}}>
          Wow, no friends added yet!!!
        </Text>
      );
    return (
      <View style={{backgroundColor: CONSTANTS.MY_GRAYBG}}>
        {friendsList.map((item, index) => (
          <PersonRowItem
            data={item}
            key={index}
            navigation={this.props.navigation}
          />
        ))}
      </View>
    );
  }

  _renderPosts() {
    if (this.state.isLoading) return <LoadingSpinner />;
    if (this.state.posts == null) return null;
    return (
      <View>
        {this.state.posts.map((item, index) => (
          <PostItem
            data={item}
            key={index}
            callback={this.handleLoadingPosts}
            navigation={this.props.navigation}
          />
        ))}
      </View>
    );
  }
  _renderAbout() {
    // if (this.state.isLoading) return <LoadingSpinner />;
    const intro = this.state.userData
      ? this.state.userData.introduction
      : '...';
    const skillDescription =
      'Skills are great way for people to know what makes who you are';
    const skillList = this.state.userData ? this.state.userData.skills : [];

    return (
      <View style={{marginHorizontal: 15}}>
        <Text style={{...styles.title}}>Introduction</Text>
        <Text style={{marginTop: 10, marginBottom: 20}}>{intro}</Text>
        <CharacterGroup
          data={this.state.userData ? this.state.userData.characterData : null}
          userId={this.state.userId}
          onReload={() => this.handleLoadingData()}
        />
        <View>
          <Text style={{...styles.title, marginTop: 40}}>Skills</Text>
          <Text style={{marginTop: 15}}>{skillDescription}</Text>
          <SkillListGroup
            onReportAction={() => this._handleSkillReport()}
            data={skillList}
            callback={() => this.handleLoadingData()}
            user={this.props.user}
            profileData={this.state.userData}
          />
        </View>
      </View>
    );
  }

  render() {
    const avatarUrl = this.state.userData.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = this.state.userData.fullName || 'Default Name';
    const email = this.state.userData.email || '@kuky.com';
    const backgroundUrl =
      this.state.userData.backgroundUrl || CONSTANTS.DEFAULT_BG;
    /* Hide wallet and money transfer feature for ios */
    /* const options = ['Report', 'Reward', 'Block', 'Cancel']; */
    const options =
      Platform.OS === 'ios'
        ? ['Report', 'Block', 'Cancel']
        : ['Report', 'Reward', 'Block', 'Cancel'];
    return (
      <View style={{flexDirection: 'column', height: '100%'}}>
        <ScrollView>
          <NavigationEvents
            onWillFocus={() => {
              this.handleLoadingData();
            }}
          />
          <ImageBackground
            style={{
              width: '100%',
              height: 200,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              backgroundColor: CONSTANTS.MY_GRAYBG,
            }}
            source={{uri: backgroundUrl}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: CONSTANTS.WIDTH,
                marginTop: CONSTANTS.SPARE_HEADER,
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="arrowleft"
                  type="AntDesign"
                  style={{marginLeft: 15, color: 'white'}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.showActionSheet}>
                <Icon
                  name="dots-three-vertical"
                  type="Entypo"
                  style={{
                    fontSize: 16,
                    fontWeight: '200',
                    marginRight: 10,
                    marginTop: 10,
                    color: 'white',
                  }}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: avatarUrl}}
              style={{
                height: 100,
                width: 100,
                marginLeft: 18,
                marginTop: -36,
                borderColor: 'white',
                borderWidth: 5,
                borderRadius: 50,
                backgroundColor: CONSTANTS.MY_GREY,
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 18}}> {fullName}</Text>
              <Text style={{fontSize: 12, color: 'gray'}}>{email}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({isScanQRModal: true})}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="qrcode"
                  type="AntDesign"
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    textAlign: 'center',
                    paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                    paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                  }}
                />
              </TouchableOpacity>
              <Text style={{marginTop: 12}}>Scan Code</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({createPostModal: true})}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="plus"
                  type="AntDesign"
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    textAlign: 'center',
                    paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                    paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                  }}
                />
              </TouchableOpacity>
              <Text style={{marginTop: 12}}>Create post</Text>
            </View>
            {this.state.isOwner ? (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('EditProfile', {
                      userId: this.props.user.userId,
                    })
                  }
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: CONSTANTS.MY_BLUE,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="edit"
                    type="AntDesign"
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      textAlign: 'center',
                      paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                      paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                    }}
                  />
                </TouchableOpacity>
                <Text style={{marginTop: 12}}>Edit Profile</Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginTop: 35,
              marginBottom: 15,
            }}>
            <TouchableOpacity onPress={() => this.handleTouchTab('Posts')}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: CONSTANTS.MY_FONT_HEADER_2_SIZE,
                  color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                  opacity: this.state.defaultTab == 'Posts' ? 1 : 0.2,
                }}>
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleTouchTab('About')}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: CONSTANTS.MY_FONT_HEADER_2_SIZE,
                  color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                  opacity: this.state.defaultTab == 'About' ? 1 : 0.2,
                }}>
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleTouchTab('Network')}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: CONSTANTS.MY_FONT_HEADER_2_SIZE,
                  color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                  opacity: this.state.defaultTab == 'Network' ? 1 : 0.2,
                }}>
                Network
              </Text>
            </TouchableOpacity>
          </View>

          {/* //render content under tab here */}
          {this.state.defaultTab == 'About'
            ? this._renderAbout()
            : this.state.defaultTab == 'Network'
            ? this._renderNetwork()
            : this._renderPosts()}
          <View style={{height: 100, width: '100%'}} />
        </ScrollView>
        <ScanQRCodeModal
          enabled={this.state.isScanQRModal}
          onClose={() => this.setState({isScanQRModal: false})}
        />
        <CreatePostModal
          enabled={this.state.createPostModal}
          onClose={() => this.setState({createPostModal: false})}
          params={{tagList: [{...this.state.userData}]}}
        />
        {/* Hide wallet and money transfer feature for ios */}
        {Platform.OS === 'ios' ? (
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Which action do you like to do?'}
            options={options}
            cancelButtonIndex={options.length - 1}
            destructiveButtonIndex={1}
            onPress={index => {
              /* do something */
              switch (index) {
                case 0:
                  this._handleReport();
                  break;
                case 1:
                  this._handleBlock();
                  break;
                default:
              }
            }}
          />
        ) : (
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Which action do you like to do?'}
            options={options}
            cancelButtonIndex={options.length - 1}
            destructiveButtonIndex={1}
            onPress={index => {
              /* do something */
              switch (index) {
                case 0:
                  this._handleReport();
                  break;
                case 1:
                  this.props.navigation.navigate('SendMoney', {
                    tagList: [this.state.userData],
                  });
                  break;
                case 2:
                  this._handleBlock();
                  break;
                default:
              }
            }}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = store => ({
  user: store.user,
});
const UserProfileScreenContainer = connect(mapStateToProps)(UserProfileScreen);
export default UserProfileScreenContainer;

const styles = {
  title: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
};
