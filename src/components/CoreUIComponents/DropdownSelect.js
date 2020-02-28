import React, { Component } from "react";
import { Text, View, Picker, TouchableOpacity } from "react-native";
import { Icon, Row } from "native-base";
import CONSTANTS from "../../common/PeertalConstants";

export default class DropdownSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { showPicker: false };
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }
  handleChangeValue(value) {
    this.props.onChangeValue(value);
    this.setState({ showPicker: false });
  }
  render() {
    const defaultData = [
      { value: "value 1", label: "label 1" },
      { value: "value 2", label: "label 2" }
    ];
    const data = this.props.data || defaultData;
    const value = this.props.value || "Select options";
    return (
      <View style={{ ...this.props.style }}>
        <TouchableOpacity
          onPress={() => this.setState({ showPicker: !this.state.showPicker })}
        >
          <View
            style={{
              //   marginHorizontal: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              borderColor: CONSTANTS.MY_BLACK_BORDER,
              borderRadius: 5,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderWidth: 1
            }}
          >
            <Text> {value} </Text>
            <Icon name="arrow-down" style={{ fontSize: 14 }} />
          </View>
        </TouchableOpacity>
        {this.state.showPicker ? (
          <Picker
            style={{ backgroundColor: "white" }}
            selectedValue={value}
            onValueChange={value => this.handleChangeValue(value)}
          >
            {data.map((item, index) => (
              <Picker.Item
                label={item.label}
                value={item.value}
                key={index}
                style={{ textTransform: "capitalize" }}
              />
            ))}
          </Picker>
        ) : null}
      </View>
    );
  }
}
