import React, {Component} from 'react'
import {
    View,
    Animated,
    Text,
    StyleSheet,
    Share,
    NativeModules,
    Dimensions,
} from 'react-native'
import {ShareDialog} from 'react-native-fbsdk'

const {InAppUtils} = NativeModules
import RNGameCenter from 'react-native-game-center'

import Button from "../Button/index";
import Logo from "../Logo/index";
import LeaderboardItem from "./Components/LeaderboardItem/index";

export default class EndScreen extends Component {
    state = {
        translateY: new Animated.Value(-20),
        opacity: new Animated.Value(0),
        userTranslateY: new Animated.Value(-20),
        userOpacity: new Animated.Value(0),
        leaderboardTranslateY: new Animated.Value(-20),
        leaderboardOpacity: new Animated.Value(0),
        canMakePurchases:true,
        priceString: "$0.99",
    }

    componentWillMount(){
        // const products = [
        //     'com.danielabdelsamed.SquareInTheAir.RemoveAdvertisements',
        // ];
        // InAppUtils.canMakePayments((enabled) => {
        //     InAppUtils.loadProducts(products, (error, products) => {
        //         if (!products[0]) return;
        //         const {priceString} = products[0]
        //         this.setState({
        //             canMakePurchases: enabled,
        //             priceString,
        //         })
        //     })
        // });
        RNGameCenter.getPlayer().then(player => {
            const {playerID} = player
            RNGameCenter.getLeaderboardPlayers({playerIds: [playerID]})
                .then((users) => {
                    const user = users[0]
                    this.setState({
                        user: user
                    })
                    Animated.parallel([
                        Animated.timing(this.state.userTranslateY, {
                            toValue: 0,
                            duration: 1000,
                        }),
                        Animated.timing(this.state.userOpacity, {
                            toValue: 1,
                            duration: 1000,
                        }),
                    ]).start()
                    RNGameCenter.getTopLeaderboardPlayers({count: 3})
                        .then((topPlayers) => {
                            this.setState({
                                topPlayers
                            })
                            Animated.parallel([
                                Animated.timing(this.state.leaderboardTranslateY, {
                                    toValue: 0,
                                    duration: 1000,
                                }),
                                Animated.timing(this.state.leaderboardOpacity, {
                                    toValue: 1,
                                    duration: 1000,
                                }),
                            ]).start()
                        })
                        .catch(() => {
                        })
                })
                .catch(() => {
                })
        }).catch(() => {
        })
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(this.state.translateY, {
                toValue: 0,
                duration: 1000,
            }),
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 1000,
            }),
        ]).start()
    }

    gameStarting = false

    startGame() {
        if (this.gameStarting) {
            return;
        }
        this.gameStarting = true
        Animated.parallel([
            Animated.timing(this.state.translateY, {
                toValue: -20,
                duration: 1000,
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 1000,
            }),
            Animated.timing(this.state.userTranslateY, {
                toValue: -20,
                duration: 1000,
            }),
            Animated.timing(this.state.userOpacity, {
                toValue: 0,
                duration: 1000,
            }),
            Animated.timing(this.state.leaderboardTranslateY, {
                toValue: -20,
                duration: 1000,
            }),
            Animated.timing(this.state.leaderboardOpacity, {
                toValue: 0,
                duration: 1000,
            }),
        ]).start(this.props.startGame)
    }

    shareScore() {
        Share.share({
            title: "Beat that!",
            message: `I got a high score of ${this.props.highScore} in Square in the Air!`,
            url: "https://itunes.apple.com/us/app/square-in-the-air/id1315382282",
        }, {}).then().catch()
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: Dimensions.get('window').height > 600 ? 200 : Dimensions.get('window').height / 2 - 150,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(255,255,255,0)',
                    zIndex: 10,
                }}
            >
                {Dimensions.get('window').height > 600 ?
                    <Animated.View style={{
                        backgroundColor: '#fcfcfc',
                        borderRadius: 15,
                        borderColor: "#555",
                        borderWidth: StyleSheet.hairlineWidth,
                        width: 300,
                        overflow: 'hidden',
                        marginBottom: 10,
                        transform: [{translateY: this.state.leaderboardTranslateY}],
                        opacity: this.state.leaderboardOpacity,
                    }}>
                        {this.state.topPlayers && this.state.user ?
                            [
                                (this.state.topPlayers[0] ?
                                    <LeaderboardItem
                                        key="1"
                                        color={{r: 255, g: 234, b: 27}}
                                        player={this.state.topPlayers[0]}
                                        user={this.state.user}/>
                                    : null),
                                (this.state.topPlayers[1] ?
                                    <LeaderboardItem
                                        key="2"
                                        color={{r: 170, g: 170, b: 170}}
                                        player={this.state.topPlayers[1]}
                                        user={this.state.user}/>
                                    : null),
                                (this.state.topPlayers[2] ?
                                    <LeaderboardItem
                                        key="3"
                                        color={{r: 232, g: 175, b: 105}}
                                        player={this.state.topPlayers[2]}
                                        user={this.state.user}/>
                                    : null),
                            ]
                            : null}
                    </Animated.View>
                    : null}


                <Animated.View style={{
                    backgroundColor: '#fcfcfc',
                    borderRadius: 15,
                    borderColor: "#555",
                    borderWidth: StyleSheet.hairlineWidth,
                    width: 300,
                    overflow: 'hidden',
                    marginBottom: 10,
                    transform: [{translateY: this.state.userTranslateY}],
                    opacity: this.state.userOpacity,
                }}>
                    {this.state.user ?
                        <LeaderboardItem player={this.state.user} user={this.state.user}/>
                        : null}
                </Animated.View>


                <Animated.View
                    style={{
                        width: 300,
                        //minHeight: 250,
                        backgroundColor: '#fcfcfc',
                        borderRadius: 15,
                        paddingTop: 15,
                        paddingBottom: 15,
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
                            margin: 5,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 24,
                            }}
                        >
                            Score: <Text style={{fontWeight: 'bold'}}>{this.props.score}</Text>
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 24,
                            }}
                        >
                            High Score: <Text style={{fontWeight: 'bold'}}>{this.props.highScore}</Text>
                        </Text>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 50,
                                alignItems: 'center',
                            }}
                        >
                            <Button color="#00f" title="Share" onPress={this.shareScore.bind(this)}/>
                            <Button color="#f00" flex={2} loading={this.props.adLoading} onPress={this.startGame.bind(this)}/>

                        </View>
                        {/*{this.props.ads && this.state.canMakePurchases ?*/}
                            {/*<View*/}
                                {/*style={{*/}
                                    {/*flexDirection: 'row',*/}
                                    {/*height: 50,*/}
                                    {/*alignItems: 'center',*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*<Button color="#0c0" bold title={`Remove Ads ${this.state.priceString}`}*/}
                                        {/*onPress={this.props.removeAds}*/}
                                {/*/>*/}


                            {/*</View>*/}
                            {/*: null}*/}
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 50,
                                alignItems: 'center',
                            }}
                        >
                            <Button flex={1} color="#ff69b4" title="Leaderboard"
                                    onPress={()=>RNGameCenter.openLeaderboardModal()}
                            />
                            {/*{this.props.ads && this.state.canMakePurchases ?*/}
                                {/*<Button color="#FF7700" title="Restore"*/}
                                        {/*onPress={this.props.restorePurchases}*/}
                                {/*/>*/}
                                {/*:null*/}
                            {/*}*/}



                        </View>

                    </View>


                </Animated.View>
            </View>
        )
    }
}