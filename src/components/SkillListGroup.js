import React, { Component } from "react";
import { View, TextInput } from "react-native";
import SkillItem from "./SkillItem";
import { OverlayLoading, Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { voteToPost, addSkill } from "../actions/userActions";

export default class SkillListGroup extends Component {
  constructor(props) {
    super(props);
    this._renderItems = this._renderItems.bind(this);
    this.state = {
      skillValue: ""
    };
    this.likeAction = this.likeAction.bind(this);
    this.disLikeAction = this.disLikeAction.bind(this);
    this.addSkillAction = this.addSkillAction.bind(this);
    this._handleReport = this._handleReport.bind(this);
  }
  likeAction(item) {
    voteToPost(this.props.user.accessToken, { id: item.id, value: "LIKE", type: "SKILL" }, this.props.callback);
  }
  disLikeAction(item) {
    voteToPost(this.props.user.accessToken, { id: item.id, value: "DISLIKE", type: "SKILL" }, this.props.callback);
  }
  addSkillAction() {
    console.log("profile Data", this.props.profileData);
    // alert("skill is" + this.state.skillValue + this.props.profileData.id);
    addSkill(this.props.user.accessToken, this.props.profileData.id, this.state.skillValue, this.props.callback);
    this.setState({ skillValue: "" });
  }
  _renderItems() {
    const df = [
      {
        id: 1,
        name: "HTML",
        totalLikes: 100,
        totalDislikes: 807,
        likeActive: true,
        dislikeActive: false,
        votedList: []
      }
    ];
    let data = this.props.data || df;
    return data.map((item, index) => (
      <SkillItem
        onReportAction={() => this.props.onReportAction()}
        data={item}
        key={index}
        onLikeAction={() => this.likeAction(item)}
        onDisLikeAction={() => this.disLikeAction(item)}
      />
    ));
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
  render() {
    return (
      <View style={{ marginTop: 15, ...this.props.style }}>
        <View style={{ flexDirection: "row", width: "100%", height: 40, borderRadius: 20, alignItems: "center" }}>
          <TextInput
            style={{
              width: CONSTANTS.WIDTH - 100 - 30,
              backgroundColor: CONSTANTS.MY_GRAYBG,
              fontSize: 14,
              color: CONSTANTS.MY_GREY,
              height: 40,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              paddingLeft: 15
            }}
            value={this.state.skillValue}
            placeholder="Add strengths"
            onChangeText={value => this.setState({ skillValue: value })}
          />
          <TouchableOpacity
            onPress={this.addSkillAction}
            style={{
              backgroundColor: CONSTANTS.MY_BLUE,
              width: 100,
              padding: 5,
              height: 40,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>Add skill </Text>
          </TouchableOpacity>
        </View>
        {this._renderItems()}
      </View>
    );
  }
}
