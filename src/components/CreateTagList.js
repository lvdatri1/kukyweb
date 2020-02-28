import React, { Component } from "react";
import { View, Text } from "react-native";
import CONSTANTS from "../common/PeertalConstants";

// import { Text } from "./CoreUIComponents";

export default class CreateTagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsers: []
    };
  }
  componentDidMount() {
    const users = this.props.data;
    let newUsers;
    switch (users.length) {
      case 1:
        newUsers = [...users];
        break;
      case 2:
        newUsers = [...users];
        newUsers[1].fullName = " and " + newUsers[1].fullName;
        break;
      case 3:
        newUsers = [...users];
        newUsers[2].fullName = " and " + users[2].fullName;
        break;
      default:
        newUsers = users.slice(0, 2);
        const newName = "and " + (users.length - 3) + " others";
        newUsers.push({ id: -111, fullName: newName });
    }
    this.setState({ newUsers: newUsers });
  }

  render() {
    const users = this.props.data;
    if (users.length == 0) return <Text style={styles.text}>No tagged</Text>;
    const callback = this.props.callback;
    const max = this.state.newUsers.length - 1;
    return this.state.newUsers.map((item, index) => {
      return (
        <Text
          style={styles.text}
          onPress={() => {
            if (item.id == -111) return;
            callback(item.id);
          }}
          key={index}
        >
          {index < max ? item.fullName + ", " : item.fullName}
        </Text>
      );
    });
  }
}

const styles = {
  text: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 12,
    color: CONSTANTS.MY_FONT_COLOR
  }
};
