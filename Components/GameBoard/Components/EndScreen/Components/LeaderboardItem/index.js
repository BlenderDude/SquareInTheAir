import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

export default class LeaderboardItem extends Component {
    componentWillMount() {
        this.r = 255 * Math.random()
        this.g = 255 * Math.random()
        this.b = 255 * Math.random()
    }

    render() {
        const {player, user} = this.props
        let color
        if (this.props.color) {
            const {r, g, b} = this.props.color
            color = {
                r: r,
                g: g,
                b: b,
            }
        } else {
            const {r, g, b} = this
            color = {
                r: r,
                g: g,
                b: b,
            }
        }
        const {r,g,b} = color
        return (
            <View
                style={{
                    padding: 10,
                    backgroundColor: `rgba(${r},${g},${b},0.5)`,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            minWidth: 40,
                            height: 40,
                            overflow: 'hidden',
                            borderRadius: 20,
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: (r + g + b) / 3 > (255 / 2) ? 'black' : 'white',
                            }}
                        >{(player.rank).toLocaleString()}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                color: (r + g + b) / 3 > (255 / 2) ? 'black' : 'white',
                            }}
                        >
                            {
                                player.playerID === user.playerID ?
                                    `${player.displayName} (${player.alias})`
                                    : player.displayName
                            }
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                color: (r + g + b) / 3 > (255 / 2) ? 'black' : 'white',
                            }}
                        >
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{player.value} </Text>
                            blocks
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}