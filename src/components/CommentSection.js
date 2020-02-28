import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Thumbnail } from 'native-base';
import CONSTANTS from '../common/PeertalConstants';
import CommentItem from './CommentItem';

export default class CommentSection extends Component {
    constructor(props) {
        super(props);
        this._renderCommentItem = this._renderCommentItem.bind(this);
    }
    _renderCommentItem() {
        if (this.props.data.length == 0) return <View />
        else {
            return this.props.data.map(item => <View key={item.id}><CommentItem data={item} /></View>);
        }
    }
    render() {

        return (
            <View style={{ flex: 1, paddingTop: 10 }}>
                {this._renderCommentItem()}
            </View>
        )
    }
}
