import React, {Component} from 'react';
import Carousel from 'react-native-snap-carousel';
import {Text, View, Image} from 'react-native';
import Video from 'react-native-video';

export default class PeertalCarousel extends Component {
  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
  }
  _renderItem({item, index}) {
    return item.search('mp4') > -1 ? (
      <Video
        source={{uri: item}}
        paused={false}
        reapeat={true}
        controls={false}
      />
    ) : (
      <Image source={{uri: item}} />
    );
  }
  render() {
    return (
      <Carousel
        {...this.props}
        layout={'default'}
        renderItem={this._renderItem}
        itemHeight={200}
        sliderHeight={200}
        itemWidth={300}
        sliderWidth={300}
      />
    );
  }
}
