import React, {Component} from 'react'
import {
    View,
    PanResponder,
    AsyncStorage,
    StatusBar,
    AppState,
    NativeModules,
    Alert,
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'

const {InAppUtils} = NativeModules
import {InterstitialAdManager, AdSettings, BannerView, NativeAdsManager} from 'react-native-fbads';
import {AppEventsLogger} from 'react-native-fbsdk'
import RNGameCenter from "react-native-game-center"

import Balloon from "./Components/Balloon/index";
import TouchManager from './TouchManager'
import WelcomeScreen from "./Components/WelcomeScreen/index";
import EndScreen from "./Components/EndScreen/index";
import Score from "./Components/Score/index";

//AdSettings.addTestDevice(AdSettings.currentDeviceHash)
//AdSettings.setLogLevel('notification')
//AdSettings.clearTestDevices()]

const ADS = true
export default class GameBoard extends Component {
    state = {
        balloons: [],
        welcomeScreen: true,
        endScreen: false,
        highScore: 0,
        adLoading: false,
        ads: true,
    }

    listening = false

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                if (!this.listening) return;
                TouchManager.touch(evt.nativeEvent.touches)
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!this.listening) return;
                TouchManager.touch(evt.nativeEvent.touches)
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (!this.listening) return;
                TouchManager.touch(evt.nativeEvent.touches)
            },
            onPanResponderTerminate: (evt, gestureState) => {
                if (!this.listening) return;
                TouchManager.touch(evt.nativeEvent.touches)
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        })
        AsyncStorage.getItem("highScore").then((res) => {
            this.setState({
                highScore: parseInt(res || 0),
            })
        })
        AppState.addEventListener('change', (newState) => {
            if (newState === 'background') {
                this.setState({balloons: []})
                this.stopGame()
            }
        })
        ReactNativeHaptic.prepare()
        // this.removeAds.bind(this)
        // this.restorePurchases.bind()
    }

    stopGame() {
        if (this.state.endScreen) {
            return;
        }
        const shouldShowAd = this.state.balloons.length > 3 && this.state.ads// && (Math.random() > 0.3)
        const highScore = Math.max(this.state.balloons.length, this.state.highScore)
        this.setState({
            endScreen: true,
            highScore: Math.max(this.state.balloons.length, this.state.highScore),
            adLoading: shouldShowAd,
            score: this.state.balloons.length,
        })
        RNGameCenter.submitLeaderboardScore({score: highScore})

        clearInterval(this.balloonInterval)
        this.listening = false
        if (this.state.balloons.length > this.state.highScore) {
            AsyncStorage.setItem("highScore", JSON.stringify(this.state.balloons.length))
        }

        TouchManager.touch([])

        if (shouldShowAd && ADS) {
            StatusBar.setHidden(true)
            this.setState({
                    balloons: []
                }, setTimeout(() => InterstitialAdManager.showAd('142396849853861_142405909852955')
                    .then(() => {
                        StatusBar.setHidden(false)
                        this.setState({
                            adLoading: false,
                        })
                    })
                    .catch((error) => {
                        StatusBar.setHidden(false)
                        this.setState({
                            adLoading: false,
                        })
                    })
            ),1500)

        } else {
            this.setState({
                endScreen: true,
                highScore: Math.max(this.state.balloons.length, this.state.highScore)
            })
        }
        AppEventsLogger.logEvent("game_end", {score: this.state.balloons.length})
    }

    startGame() {
        this.gameStarting = true
        this.setState({
            welcomeScreen: false,
            endScreen: false,
            balloons: [],
        })
        this.listening = true;
        this.balloonInterval = setInterval(this.addBalloon.bind(this), 5000)
        this.addBalloon()
    }

    addBalloon() {
        this.setState({
            balloons: this.state.balloons.concat(<Balloon key={this.state.balloons.length}
                                                          death={this.stopGame.bind(this)}/>)
        })
    }

    // removeAds() {
    //     const removeAdsIdentifier = "com.danielabdelsamed.SquareInTheAir.RemoveAdvertisements"
    //     InAppUtils.purchaseProduct(removeAdsIdentifier, (error, response) => {
    //         if (response && response.productIdentifier) {
    //             AsyncStorage.setItem("ads", JSON.stringify({showAds: false}))
    //             this.setState({ads: false})
    //         }
    //     });
    // }
    //
    // restorePurchases() {
    //     InAppUtils.restorePurchases((error, response) => {
    //         if (error) {
    //             Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
    //         } else {
    //
    //             if (response.length === 0) {
    //                 return;
    //             }
    //
    //             response.forEach((purchase) => {
    //                 if (purchase.productIdentifier === 'com.danielabdelsamed.SquareInTheAir.RemoveAdvertisements') {
    //                     Alert.alert('Restore Successful', 'Successfully restores all your purchases.');
    //                     AsyncStorage.setItem("ads", JSON.stringify({showAds: false}))
    //                     this.setState({ads: false})
    //                 }
    //             });
    //         }
    //     });
    // }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.welcomeScreen ?
                    <WelcomeScreen
                        startGame={this.startGame.bind(this)}
                    />
                    : null}
                {this.state.endScreen ?
                    <EndScreen
                        startGame={this.startGame.bind(this)}
                        score={this.state.score}
                        highScore={this.state.highScore}
                        adLoading={this.state.adLoading}
                        //removeAds={this.removeAds.bind(this)}
                        //restorePurchases={this.restorePurchases.bind(this)}
                        ads={this.state.ads}
                    />
                    : null}

                <View style={{flex: 1}} {...this._panResponder.panHandlers}>
                    <Score
                        score={this.state.balloons.length}
                        welcomeScreen={this.state.welcomeScreen}
                        endScreen={this.state.endScreen}
                    />
                    {this.state.balloons}
                </View>
            </View>
        )
    }
}