import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

export default class LoginBanner extends Component {
    componentDidMount = () => {

    }

    render() {
        return (
            <View style={{ width: "100%", aspectRatio: 2 / 1 }}>
                <Image
                    style={{ marginTop: 30, alignSelf: 'center' }}
                    source={require('../assets/login/logo.png')}
                />

            </View>
        )
    }
}
