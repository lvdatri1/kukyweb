import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";

class PeertalButton extends Component {

    render() {
        let { buttonColor, textColor, text } = this.props;
        if (buttonColor == null) {
            buttonColor = '#fff';
        }
        if (textColor == null) {
            textColor = '#000';
        }

        let styleButton;
        if (buttonColor == 'transparent') {
            styleButton = {
                flexDirection: 'row',
                width: 303,
                height: 48,
                alignItems: 'center',
                marginBottom: 10
            };
        } else {
            styleButton = {
                flexDirection: 'row',
                width: 303,
                height: 48,
                alignItems: 'center',
                borderRadius: 2,
                backgroundColor: buttonColor,
                shadowOffset: { width: 0, height: 0 },
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 1,
                marginBottom: 10
            };
        }

        const styleText = {
            flex: 1,
            color: textColor,
            textAlign: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontFamily: 'SFProDisplay-Semibold',
            letterSpacing: -0.03
        };
        return (
            <TouchableOpacity
                style={[styleButton, this.props.style]}
                onPress={this.props.onClick}
            >
                <View style={{ position: 'absolute' }}>
                    {this.props.renderIcon !== undefined ? this.props.renderIcon() : null}
                </View>
                <Text style={styleText}>{text}</Text>
            </TouchableOpacity>
        );
    }
}
export default PeertalButton;