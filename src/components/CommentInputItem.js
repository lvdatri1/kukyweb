import React, {Component} from 'react';
import {Image, Keyboard, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {createCommentOnAPost} from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';

class CommentInputItem extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '', isLoading: false};
    this.onCommentAction = this.onCommentAction.bind(this);
  }

  onCommentAction() {
    if (this.props.user.loggedStatus === 'guest') {
      this.props.navigation.navigate('Welcome');
      return;
    }
    if (this.state.text == '') return;
    var commentData = {
      content: this.state.text,
      objectId: this.props.data.id,
      isIncognito: false,
      parentCommentId: 0,
      objectType: 'POST',
    };
    this.setState({isLoading: true});
    createCommentOnAPost(
      this.props.user.accessToken,
      commentData,
      res => {        
        //after successfull commented, we will add comment to posts' Reducer
        if (this.props.callback) {
          this.setState({text: '', isLoading: false});
          this.props.callback();
          this.props.showCommentOnce(res.data.data,this.props.data.id);
          return;
        }
        let newCommentObject = res.data.data;
        this.props.showCommentOnce(res.data.data,this.props.data.id);
        let updatedPost = {
          ...this.props.data,
          totalComments: this.props.data.totalComments + 1,
        };
        updatedPost.comments.push(newCommentObject);
        this.props.dispatch({
          type: 'UPDATE_COMMENTS_ONE_POST',
          data: {post: updatedPost},
        });

        // this.setState({ text: "" });
        //

      },
      err => {
        this.setState({isLoading: false});
      },
    );
    Keyboard.dismiss();
    this.setState({text: ''});
  }

  render() {
    const onFocus = this.props.onFocus;
    const onBlur = this.props.onBlur;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View
          style={{
            width: CONSTANTS.WIDTH - 32 - 40,
            marginLeft: 12,
            height: 42,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 20,
          }}>
          <TextInput
            onFocus={e => {
              if (onFocus) onFocus();
            }}
            onBlur={e => {
              if (onBlur) onBlur();
            }}
            placeholder="Leave a comment..."
            onSubmitEditing={this.onCommentAction}
            returnKeyType={'send'}
            value={this.state.text}
            onChangeText={text =>
              this.setState({
                ...this.state,
                text: text,
              })
            }
            style={{
              color: 'gray',
              marginLeft: 10,
              paddingTop: CONSTANTS.OS === 'android' ? 10 : 0,
              fontSize: 14,
              minWidth: 200,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
            }}
          />
        </View>
        <TouchableOpacity
          style={{marginTop: 10, marginRight: 16}}
          onPress={this.onCommentAction}>
          <Image source={require('../assets/xd/Icons/sent-mail.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}
const MapStateToProps = store => ({user: store.user});
const CommentInputContainer = connect(MapStateToProps)(CommentInputItem);
export default CommentInputContainer;
