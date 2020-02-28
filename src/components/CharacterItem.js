import React, {Component} from 'react';
import {View} from 'react-native';
import {Text} from './CoreUIComponents';
import CONSTANTS from '../common/PeertalConstants';
import {Icon} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class CharacterItem extends Component {
  _renderCheckIcon() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: CONSTANTS.MY_BLUE,
          width: 24,
          height: 24,
          borderRadius: 14,
        }}>
        <Icon
          name="check"
          type="FontAwesome"
          style={{color: 'white', fontSize: 16}}
        />
      </View>
    );
  }
  render() {
    const left = this.props.data.left;
    const right = this.props.data.right;
    const leftBigger = left.number > right.number;
    const leftActive = left.active;
    const rightActive = right.active;
    const leftNumber = left.number;
    const rightNumber = right.number;
    const leftName = left.name;
    const rightName = right.name;
    const defaultVote = name => alert('default name   ' + name);
    const leftVote = this.props.onLeftVote || defaultVote;
    const rightVote = this.props.onRightVote || defaultVote;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 17,
        }}>
        <TouchableOpacity onPress={() => leftVote(left.name)}>
          <View
            style={{
              width: 150,
              height: 40,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: CONSTANTS.MY_BLUE,
              backgroundColor: leftBigger ? CONSTANTS.MY_BLUE : 'white',
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: leftBigger ? 'white' : CONSTANTS.MY_BLUE,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: CONSTANTS.MY_BLUE,
              }}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  color: leftBigger ? CONSTANTS.MY_BLACK_BORDER : 'white',
                }}>
                {leftNumber}
              </Text>
            </View>
            <View style={{width: 106, alignItems: 'center', paddingRight: 10}}>
              <Text
                style={{
                  color: leftBigger ? 'white' : CONSTANTS.MY_BLACK_BORDER,
                }}>
                {leftName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            marginLeft: -16,
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: CONSTANTS.MY_BLUE,
            zIndex: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {leftActive ? this._renderCheckIcon() : null}
        </View>
        <View
          style={{
            width: 12,
            height: 20,
            marginHorizontal: -5,
            backgroundColor: CONSTANTS.MY_BLUE,
            zIndex: 1,
          }}
        />
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: -16,
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: CONSTANTS.MY_BLUE,
            zIndex: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {rightActive ? this._renderCheckIcon() : null}
        </View>
        <TouchableOpacity onPress={() => rightVote(rightName)}>
          <View
            style={{
              width: 150,
              height: 40,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: CONSTANTS.MY_BLUE,
              backgroundColor: leftBigger ? 'white' : CONSTANTS.MY_BLUE,
            }}>
            <View style={{width: 106, alignItems: 'center', paddingLeft: 10}}>
              <Text
                style={{
                  color: leftBigger ? CONSTANTS.MY_BLACK_BORDER : 'white',
                }}>
                {rightName}
              </Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: leftBigger ? CONSTANTS.MY_BLUE : 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: CONSTANTS.MY_BLUE,
              }}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  color: leftBigger ? 'white' : CONSTANTS.MY_BLACK_BORDER,
                }}>
                {rightNumber}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
