import React, {Component} from 'react'
import {
    View,
    Text,
    Animated
} from 'react-native'

export default class Score extends Component {
    state = {
        scoreOpacity: new Animated.Value(0)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.welcomeScreen || nextProps.endScreen) {
            Animated.timing(this.state.scoreOpacity, {
                toValue: 0,
                duration: 1000,
            }).start()
        } else {
            Animated.timing(this.state.scoreOpacity, {
                toValue: 1,
                duration: 1000,
            }).start()
        }
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: "100%",
                    alignItems: 'center',
                }}
            >
                <Animated.View
                    style={{
                        width: 400,
                        height: 50,
                        marginTop: 50,
                        opacity: this.state.scoreOpacity
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 48,
                        }}
                    >
                        {this.props.score}
                    </Text>
                </Animated.View>

            </View>
        )
    }
}