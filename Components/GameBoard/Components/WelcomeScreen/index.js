import React, {Component} from 'react'
import {
    View,
    Animated,
    Text,
    StyleSheet, TouchableOpacity
} from 'react-native'
import Button from "../Button/index";
import Logo from "../Logo/index";

export default class WelcomeScreen extends Component {
    state={
        translateY: new Animated.Value(-20),
        opacity: new Animated.Value(0),
    }
    componentDidMount(){
        Animated.parallel([
            Animated.timing(this.state.translateY,{
                toValue: 0,
                duration: 1000,
            }),
            Animated.timing(this.state.opacity,{
                toValue: 1,
                duration: 1000,
            }),
        ]).start()
    }
    gameStarting = false
    startGame(){
        if(this.gameStarting){
            return;
        }
        this.gameStarting = true
        Animated.parallel([
            Animated.timing(this.state.translateY,{
                toValue: -20,
                duration: 1000,
            }),
            Animated.timing(this.state.opacity,{
                toValue: 0,
                duration: 1000,
            }),
        ]).start(this.props.startGame)
    }
    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0)',
                    zIndex: 10,
                }}
            >
                <Animated.View
                    style={{
                        width: 300,
                        height: 200,
                        backgroundColor: '#fcfcfc',
                        borderRadius: 15,
                        paddingTop: 15,
                        borderColor: "#555",
                        borderWidth: StyleSheet.hairlineWidth,
                        alignItems: 'center',
                        transform: [{translateY: this.state.translateY}],
                        opacity: this.state.opacity,
                    }}
                >
                    <Logo/>
                    <View
                        style={{
                            flex: 1,
                            margin: 5,
                        }}
                    >
                    </View>
                    <View
                        style={{
                            marginHorizontal: 10,
                            width: "100%",
                        }}
                    >
                        <View
                            style={{
                                height: 50,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Button color="#f00" loading={this.props.adLoading} onPress={this.startGame.bind(this)}/>
                        </View>
                    </View>
                </Animated.View>
            </View>
        )
    }
}