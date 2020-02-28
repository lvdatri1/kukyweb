import React, { Component } from "react";
import { Text, View } from "react-native";
import PeertalPlayer from "./PeertalMediaPlayer";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";

export default class PeertalMediaCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = { activeSlide: 0 };
  }
  render() {
    const data = this.props.data;
    if (data == null) return <View />;
    // if (data.length == 0) return <View />;
    let imgArray = data.map(item => item.url);
    const mediaContent = (
      <Carousel
        data={imgArray}
        itemHeight={375}
        sliderHeight={375}
        itemWidth={CONSTANTS.WIDTH}
        sliderWidth={CONSTANTS.WIDTH}
        onSnapToItem={index => this.setState({ activeSlide: index })}
        layout={"default"}
        renderItem={({ item, index }) => (
          <PeertalPlayer key={index} source={{ uri: item }} data={data} />
        )}
      />
    );
    let dots = <View style={{ width: CONSTANTS.WIDTH, height: 20 }} />;
    if (data.length > 1)
      dots = data.map((item, index) => {
        if (index === this.state.activeSlide)
          return (
            <Icon
              key={index}
              name="dot-single"
              type="Entypo"
              style={{
                alignSelf: "center",
                marginLeft: -22,
                color: CONSTANTS.MY_BLUE,
                fontSize: 40
              }}
            />
          );
        else
          return (
            <Icon
              key={index}
              name="dot-single"
              type="Entypo"
              style={{
                alignSelf: "center",
                marginLeft: -22,
                color: "gray",
                fontSize: 30
              }}
            />
          );
      });
    return (
      <View>
        {mediaContent}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          {dots}
        </View>
      </View>
    );
  }
}
