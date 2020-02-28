import React, { Component } from "react";
import CONST from "../common/PeertalConstants";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Card,
  Title,
  CardItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Form,
  Textarea,
  Item,
  Label,
  Input
} from "native-base";
import {
  Text,
  Modal,
  TouchableHighlight,
  View,
  Alert,
  Image,
  TextInput
} from "react-native";

import { connect } from "react-redux";
import PersonRowItem from "./PersonRowItem";
import PostItem from "./PostItem";

class TopSearchIcon extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false, searchText: "" };
    this.renderPeopleList = this.renderPeopleList.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }
  _generateKey(a, b) {
    return a.toString() + b.toString();
  }
  renderPeopleList() {
    const result = this.props.people.people.filter(
      item =>
        (item.firstName + " " + item.lastName)
          .toLowerCase()
          .search(this.state.searchText.toLowerCase()) > -1
    );
    console.log("search out", result);
    return result.map((item, index) =>
      item == null ? (
        <View id={index} key={index} />
      ) : (
        <PersonRowItem
          data={item}
          id={item.id}
          key={this._generateKey(item.id, index)}
        />
      )
    );
  }
  renderPostList() {
    console.log("content of posts", this.props.posts.posts);
    const result = this.props.posts.posts.filter(item => {
      if (item.content == null) return false;
      else if (
        item.content.toLowerCase().search(this.state.searchText.toLowerCase()) >
        -1
      )
        return true;
      else return false;
    });
    // const result = this.props.posts.posts;
    console.log("search out", result);
    return result.map((item, index) =>
      item == null ? (
        <View id={index} key={index} />
      ) : (
        <PostItem
          data={item}
          id={item.id}
          key={this._generateKey(item.id, index)}
        />
      )
    );
  }
  handleSearch() {}
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    const tabStatus = this.props.tabStatus;
    return (
      <Button transparent onPress={() => this.setModalVisible(true)}>
        <Icon name="search" />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <Container>
            <Header>
              <Left>
                <Button
                  hasText
                  transparent
                  onPress={() => this.setModalVisible(false)}
                >
                  <Text>Cancel</Text>
                </Button>
              </Left>
              <Body style={{ paddingLeft: 0, width: 250 }}>
                <Item
                  style={{
                    width: CONST.WIDTH - 140,
                    paddingLeft: 10,
                    height: 40
                  }}
                >
                  <Input
                    placeholder="Search here"
                    value={this.state.searchText}
                    onChangeText={text =>
                      this.setState({ ...this.state, searchText: text })
                    }
                  />
                </Item>
              </Body>
              <Right>
                <Button transparent onPress={this.handleSearch}>
                  <Icon name="search" />
                </Button>
              </Right>
            </Header>
            <Content>
              {tabStatus === "PEOPLE"
                ? this.renderPeopleList()
                : this.renderPostList()}
            </Content>
          </Container>
        </Modal>
      </Button>
    );
  }
}
const MapsStateToProps = store => ({
  people: store.people,
  posts: store.posts
});
const SearchFeature = connect(MapsStateToProps)(TopSearchIcon);
export default SearchFeature;
