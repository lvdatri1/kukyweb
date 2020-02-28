import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import {connect} from 'react-redux';
import CONSTANTS from '../common/PeertalConstants';

import {Text} from '../components/CoreUIComponents';
import CreatePostModal from './CreatePostModal';

//@flow
class NewFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPostModal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
    if (this.props.user.loggedStatus == 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    this.setState({createPostModal: !this.state.createPostModal});
  }
  render() {
    //all variables below is for Modal of Post
    const active = this.props.active || 'conversation';
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingHorizontal: 5,
        }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Discover')}
          style={{
            width: '20%',
            height: '100%',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <Icon
            name="newspaper"
            type="MaterialCommunityIcons"
            style={{
              color: active == 'conversation' ? CONSTANTS.MY_BLUE : 'black',
            }}
          />
          <Text style={{fontSize: 10}}>Conversation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('PeopleList')}
          style={{
            width: '20%',
            height: '100%',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <Icon
            style={{color: active == 'people' ? CONSTANTS.MY_BLUE : 'black'}}
            name="people"
            type="MaterialIcons"
          />
          <Text style={{fontSize: 10}}>People</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.toggleModal()}
          style={{
            width: '20%',
            height: '100%',
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              style={{
                color: 'white',
                textAlign: 'center',
                paddingTop: CONSTANTS.OS == 'ios' ? 1.5 : 0,
              }}
              name="plus"
              type="Entypo"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (this.props.user.loggedStatus == 'guest') {
              this.props.navigation.navigate('Welcome');
            } else this.props.navigation.navigate('Notification');
          }}
          style={{
            width: '20%',
            height: '100%',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <Icon
            name="bell"
            type="MaterialCommunityIcons"
            style={{
              color: active == 'notification' ? CONSTANTS.MY_BLUE : 'black',
            }}
          />
          <Text style={{fontSize: 10}}>Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('MapView')}
          style={{
            width: '20%',
            height: '100%',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <Icon
            name="map"
            type="MaterialCommunityIcons"
            style={{color: active == 'mapView' ? CONSTANTS.MY_BLUE : 'black'}}
          />
          <Text style={{fontSize: 10}}>Map View</Text>
        </TouchableOpacity>
        <CreatePostModal
          enabled={this.state.createPostModal}
          onClose={() => this.setState({createPostModal: false})}
        />
      </View>
    );
  }
}

const MapStateToProps = store => ({
  user: store.user,
  peopleList: store.people.peopleList,
});
const FooterContainer = connect(MapStateToProps)(NewFooter);
export default FooterContainer;
