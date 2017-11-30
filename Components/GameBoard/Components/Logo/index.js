import React, {Component} from 'react'
import {
    View,
    Text,
} from 'react-native'

export default class Logo extends Component {
    render() {
        return (
            <View>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 32,
                        lineHeight: 32,
                        fontWeight: 'bold'
                    }}
                >
                    Square
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        lineHeight: 18,
                        textAlign: 'center',
                    }}
                >
                    in the air
                </Text>
            </View>
        )
    }
}