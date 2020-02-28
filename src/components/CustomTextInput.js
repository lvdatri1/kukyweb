import React, { Component } from "react";
import { View, TextInput, Text } from "react-native";
import { StyleSheet } from "react-native";

import GlobalStyles from "../common/PeertalStyles";
import Constants from "../common/PeertalConsts";

const Styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    width: 303,
    height: 70,
    backgroundColor: Constants.color.darkWhite,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "black",
    borderRadius: 2,
    shadowOpacity: 0.2,
    elevation: 1,
    marginBottom: 12
  }
});

class CustomTextInput extends Component {
  state = {
    text: ""
  };

  getText = () => {
    return this.state.text;
  };

  render() {
    return (
      <View style={Styles.textInputContainer}>
        {this.props.renderIcon !== undefined ? this.props.renderIcon() : null}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              GlobalStyles.text.caption,
              {
                color: Constants.color.secondaryText,
                alignItems: "flex-start"
              }
            ]}
          >
            {this.props.caption}
          </Text>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder={this.props.caption + " ..."}
            multiline={false}
            blurOnSubmit={true}
            placeholderTextColor={Constants.color.secondaryText}
            style={[
              GlobalStyles.text.subheading,
              {
                flex: 1,
                color: Constants.color.primaryText,
                alignItems: "flex-start",
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
              }
            ]}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
        </View>
      </View>
    );
  }
}

export default CustomTextInput;
