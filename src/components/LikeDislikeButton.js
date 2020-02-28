import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, Animated, Easing } from 'react-native'

export default class LikeDislikeButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: new Animated.Value(1)
        };
        this.handleTouch = this.handleTouch.bind(this);
    }
    componentDidMount() {
        // Animated.timing(this.state.zoom, {
        //     toValue: 1,
        //     duration: 3000,
        // }).start();

    }
    handleTouch() {
        this.state.zoom.setValue(0);
        Animated.timing(this.state.zoom, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bounce
        }).start();
    }

    render() {
        const type = this.props.type || 'like';
        const active = this.props.active || false;
        const onPress = this.props.onPress;
        let sourceIcon;
        if (type == 'like' && active) sourceIcon = require('../assets/xd/Icons/active_arrow_up.png');
        if (type == 'like' && !active) sourceIcon = require('../assets/xd/Icons/inactive_arrow_up.png');
        if (type == 'dislike' && active) sourceIcon = require('../assets/xd/Icons/active_arrow_down.png');
        if (type == 'dislike' && !active) sourceIcon = require('../assets/xd/Icons/inactive_arrow_down.png');
        if (type == 'comment') sourceIcon = require('../assets/xd/Icons/comment_icon.png');
        if (type == 'share') sourceIcon = require('../assets/xd/Icons/share_icon.png');
        let opa = this.state.zoom;
        const RotateData = this.state.zoom.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        const onTouch = () => { this.handleTouch(); onPress ? onPress() : null; }
        return (
            <TouchableOpacity {...this.props} onPress={onTouch}>
                <Animated.View style={{ opacity: opa, transform: [{ rotate: RotateData }] }}>
                    <Image source={sourceIcon} />
                </Animated.View>
            </TouchableOpacity>
        )
    }
}
