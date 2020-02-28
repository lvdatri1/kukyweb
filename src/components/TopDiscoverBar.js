import { Icon } from "native-base";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import React, { Component } from "react";
import CONSTANTS from "../common/PeertalConstants";

class TopDiscoverBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { handleTimeline, handlePopular, handleLocation } = this.props;
    return (
      <View style={styles.filterBar}>
        <TouchableOpacity onPress={handleTimeline}>
          <View style={styles.filterButton}>
            <Icon name="md-time" />
            <View style={styles.textInButton}>
              <Text>Timeline</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePopular}>
          <View style={styles.filterButton}>
            <Icon name="ios-trending-up" />
            <View style={styles.textInButton}>
              <Text>Popular</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLocation}>
          <View style={styles.filterButton}>
            <Icon name="ios-pin" />
            <View style={styles.textInButton}>
              <Text>Location</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default TopDiscoverBar;

const styles = StyleSheet.create({
  filterButton: {
    flex: 1,
    flexDirection: "row",

    width: (CONSTANTS.WIDTH > 330 ? 330 : CONSTANTS.WIDTH) / 3,
    color: "royalblue"
  },
  textInButton: {
    fontSize: 12,
    paddingTop: 5,
    marginLeft: 3,
    color: "royalblue"
  },

  filterBar: {
    flex: 1,
    flexDirection: "row",

    alignItems: "center",
    marginTop: 10,
    maxWidth: 330,
    alignSelf: "center"
  }
});
