import {Icon, Text} from 'native-base';
import React from 'react';
import {Image, TouchableOpacity, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import CONSTANTS from '../common/PeertalConstants';

const routes = ['Home', 'Chat', 'Profile'];

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderFooter();
  }

  handleLogout() {
    this.props.dispatch({type: 'LOGOUT_MENU'});
    this.props.dispatch({type: 'USER_LOGOUT'});
    this.props.navigation.navigate('Welcome');
  }

  _renderItem() {
    return this.props.data.map((item, index) => {
      /* Hide wallet and money transfer feature for ios */
      if(Platform.OS!=='ios' || item.name != "Wallet"){ // just added if clause...
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(item.screen, item.param)
          }
          key={index}
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
            marginLeft: 20,
            backgroundColor: 'white',
            flexDirection: 'row',
            marginTop: 25,
            alignItems: 'center',
          }}>
          <Icon name={item.icon} type={item.iconType} style={{fontSize: 20}} />
          <Text
            style={{
              marginLeft: 10,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
              fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    });
  }

  _renderFooter() {
    return (
      <TouchableOpacity
        onPress={this.handleLogout}
        style={{
          flexDirection: 'row',
          justitfyContent: 'flex-start',
          marginLeft: 20,
          alignItems: 'center',
        }}>
        <Icon name="logout" type="MaterialCommunityIcons" />
        <Text
          style={{
            marginLeft: 10,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
          }}>
          Log out
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {data} = this.props;
    const headerHeight = CONSTANTS.SPARE_HEADER + 250;
    const footerHeight = CONSTANTS.SPARE_FOOTER + 62;
    const mainHeight = CONSTANTS.HEIGHT - headerHeight - footerHeight;
    const backgroundUrl = this.props.user.backgroundUrl || CONSTANTS.DEFAULT_BG;
    const avatarUrl = this.props.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    return (
      <View
        style={{
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          backgroundColor: 'red',
        }}>
        <View
          style={{
            flex: headerHeight,
            backgroundColor: 'white',
            height: headerHeight,
            width: '100%',
          }}>
          <Image
            style={{height: headerHeight - 110, width: '100%'}}
            source={{uri: backgroundUrl}}
          />
          <Image
            source={{
              uri: avatarUrl,
            }}
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 4,
              borderColor: 'white',
              marginTop: -50,
              marginLeft: 16,
            }}
          />
          <Text
            style={{
              marginLeft: 16,
              marginTop: 8,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL_2,
            }}>
            {this.props.user.fullName}
          </Text>
          {/* <Text
            style={{
              marginLeft: 16,
              fontSize: 12,
              color: "gray"
            }}
          >
            {this.props.user.email}
          </Text> */}
        </View>
        <View style={{flex: mainHeight, backgroundColor: 'white'}}>
          {this._renderItem()}
        </View>
        <View
          style={{
            flex: footerHeight,
            backgroundColor: 'white',
            borderTopColor: 'gray',
            borderTopWidth: 1,
            height: footerHeight,
            flexDirection: 'row',
            justitfyContent: 'cetner',
            alignItems: 'center',
            paddingBottom: CONSTANTS.SPARE_FOOTER,
          }}>
          {this.props.user.loggedStatus !== 'guest'
            ? this._renderFooter()
            : null}
        </View>
      </View>

      // <Container style={{ marginTop: 20 }}>

      //     <Content>

      //         <Thumbnail style={{ marginTop: 50, alignSelf: 'center' }}
      //             source={{ uri: this.props.user.avatar }}
      //             large>

      //         </Thumbnail>
      //         <View style={{ alignItems: 'center' }}>
      //             <Text style={{ fontWeight: 'bold', }}> Hello
      // {this.props.user.fullName} </Text> <Text style={{ fontWeight:
      // 'normal', }}>  {this.props.user.email} </Text> </View> <FlatList
      // data={data.map((item, index) => ({ ...item, key: index + '' }))}
      // renderItem={({ item }) => { return ( <ListItem id={item.key} button
      // onPress={() => this.props.navigation.navigate(item.name)}> <Icon
      // name={item.icon} type={item.iconType} /> <Text style={{ marginLeft:
      // 10 }}>{item.name}</Text> </ListItem> ); }} /> <Button onPress={() =>
      // this.props.dispatch({ type: "LOGGED_MENU" })}> <Text>Login - change
      // menu</Text> </Button>

      //     </Content >
      //     <Footer>
      //         <Left>
      //             <Button style={{}} onPress={() => this.props.dispatch({
      // type: "RESET_MENU" })}> <Text>Logout</Text> </Button> </Left>
      // </Footer> </Container >
    );
  }
}

const MapStateToProps = store => ({
  data: store.sideMenu,
  user: store.user,
});

const SideMenuLive = connect(MapStateToProps)(SideMenu);
export default SideMenuLive;
