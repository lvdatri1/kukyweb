import React, { Component } from "react";
import { View, Image, ImageBackground, TouchableOpacity } from "react-native";
import { Text } from "./CoreUIComponents";
import CharacterItem from "./CharacterItem";
import { connect } from "react-redux";
import CONSTANTS from "../common/PeertalConstants";
import { voteCharacter } from "../actions/userActions";

class CharacterGroup extends Component {
  constructor(props) {
    super(props);
    this.handleVote = this.handleVote.bind(this);
  }
  componentDidMount() {
    this.setState({
      characterData: this.props.data
    });
  }
  handleVote(character) {
    voteCharacter(this.props.user.accessToken, this.props.userId, character, res => {
      this.props.onReload();
    });
  }
  render() {
    var item1 = {
      left: { name: "introvert", number: 15, active: true },
      right: { name: "extrovert", number: 11, active: false }
    };
    var item2 = {
      left: { name: "observant", number: 15, active: true },
      right: { name: "intuitive", number: 11, active: false }
    };
    var item3 = {
      left: { name: "thinking", number: 15, active: false },
      right: { name: "feeling", number: 11, active: true }
    };
    var item4 = {
      left: { name: "judging", number: 15, active: false },
      right: { name: "prospecting", number: 11, active: false }
    };
    var characterData = this.props.data;
    const cName = characterData ? characterData.name : "...";
    const cImageUrl = characterData
      ? characterData.image || CONSTANTS.RANDOM_IMAGE
      : "https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/characters/man-Adventurer.png";
    const cDescription = characterData ? characterData.summary : "...";
    if (characterData) {
      item1.left = { name: "introvert", number: characterData.introvert.total, active: characterData.introvert.active };
      item1.right = {
        name: "extrovert",
        number: characterData.extrovert.total,
        active: characterData.extrovert.active
      };
      item2.left = { name: "observant", number: characterData.observant.total, active: characterData.observant.active };
      item2.right = {
        name: "intuitive",
        number: characterData.intuitive.total,
        active: characterData.intuitive.active
      };
      item3.left = { name: "thinking", number: characterData.thinking.total, active: characterData.thinking.active };
      item3.right = { name: "feeling", number: characterData.feeling.total, active: characterData.feeling.active };
      item4.left = { name: "judging", number: characterData.judging.total, active: characterData.judging.active };
      item4.right = {
        name: "prospecting",
        number: characterData.prospecting.total,
        active: characterData.prospecting.active
      };
    }
    return (
      <View>
        <Text style={{ marginTop: 20, fontSize: 18, fontFamily: "Montserrat-SemiBold" }}>Character</Text>
        <ImageBackground
          style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 30 }}
          source={require("../assets/xd/background/character_bg.png")}
        >
          <Image
            style={{
              backgroundColor: "white",
              borderRadius: 85,
              width: 170,
              height: 170,
              marginLeft: 45,
              marginTop: 15,
              zIndex: 2
            }}
            source={{ uri: cImageUrl }}
          />
          <View
            style={{
              height: 120,
              width: 120,
              marginLeft: -5,
              borderRadius: 60,
              backgroundColor: CONSTANTS.MY_BLUE,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1
            }}
          >
            <Text style={{ color: "white",fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize:15 }}>{cName}</Text>
          </View>
        </ImageBackground>
        <Text style={{ marginTop: 20, marginBottom: 15 }}>{cDescription}</Text>
        <CharacterItem data={item1} onLeftVote={this.handleVote} onRightVote={this.handleVote} />
        <CharacterItem data={item2} onLeftVote={this.handleVote} onRightVote={this.handleVote} />
        <CharacterItem data={item3} onLeftVote={this.handleVote} onRightVote={this.handleVote} />
        <CharacterItem data={item4} onLeftVote={this.handleVote} onRightVote={this.handleVote} />
      </View>
    );
  }
}
const mapStateToProps = store => ({ user: store.user });
const CharacterGroupContainer = connect(mapStateToProps)(CharacterGroup);
export default CharacterGroupContainer;
