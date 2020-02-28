import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'


export class LoginButton extends Component {
    render() {
        const { imageSource, textCenter, bgColor } = this.props;
        return (
            <View style={{ backgroundColor: bgColor }}>
                <Image
                    style={{ marginTop: 30, alignSelf: 'flex-start' }}
                    source={imageSource}
                />
                <Text> {textCenter} </Text>
            </View>
        )
    }
}

export default LoginButton
