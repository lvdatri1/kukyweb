import React, {Component} from 'react';
import {Text, View, Image, Modal, TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import Video from 'react-native-video';
import LightBox from 'react-native-lightbox';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Icon} from 'native-base';
import CONSTANTS from '../common/PeertalConstants';

const radiusPixel = 0; //CONSTANTS.WIDTH / 350 * 5

export default class PeertalMediaPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      videoRate: 1.0,
      videoPaused: true,
    };
  }
  render() {
    const images = this.props.data.map(item => {
      return {url: item.url};
    });

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.props.source.uri.search('mp4') < 0)
              this.setState({modalVisible: true});
            else {
              this.setState({videoPaused: !this.state.videoPaused});
            }
          }}>
          {this.props.source.uri.search('mp4') > -1 ? (
            <View>
              <Video
                style={{
                  flex: 1,
                  height: (CONSTANTS.WIDTH * 9) / 16,
                  borderRadius: radiusPixel,
                  backgroundColor: 'gray',
                }}
                {...this.props}
                paused={this.state.videoPaused}
                rate={this.state.videoRate}
                repeat={true}
                controls={false}
                resizeMode="contain"
              />
              <View
                style={{
                  marginTop: 0 - (CONSTANTS.WIDTH * 9) / 16,
                  height: (CONSTANTS.WIDTH * 9) / 16,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="ios-play"
                  style={{
                    fontSize: 70,
                    color: 'white',
                    opacity: this.state.videoPaused ? 0.8 : 0,
                  }}></Icon>
              </View>
            </View>
          ) : (
            <Image
              style={{
                flex: 1,
                height: CONSTANTS.WIDTH,
                borderRadius: radiusPixel,
                backgroundColor: 'gray',
              }}
              {...this.props}
            />
          )}
        </TouchableWithoutFeedback>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <ImageViewer
            imageUrls={images.filter(item => item.url.search('mp4') < 0)}
            onCancel={() => this.setState({modalVisible: false})}
            onSwipeDown={() => this.setState({modalVisible: false})}
            enableSwipeDown={true}
            renderHeader={currentHeader => {
              return (
                <TouchableOpacity
                  style={{position: 'absolute', zIndex: 1}}
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text
                    style={{
                      color: 'white',
                      marginHorizontal: 15,
                      marginTop: CONSTANTS.SPARE_HEADER,
                    }}>
                    close
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </Modal>
      </View>
    );
  }
}
