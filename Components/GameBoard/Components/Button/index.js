import React, {Component} from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View, ActivityIndicator,
    Platform
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'

export default class Button extends Component {

    hexToRgbA(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.05)';
        }
    }
    onPress(){
        if(Platform.OS==="ios"){
            ReactNativeHaptic.generate('impact')
        }
        this.props.onPress()
    }
    render() {
        return (
            <TouchableOpacity
                style={{
                    flex: this.props.flex||1,
                    borderColor: this.props.color,
                    borderWidth: 2,
                    borderRadius: 20,
                    marginHorizontal: 10,
                    overflow: 'hidden',
                    height: 40,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:this.hexToRgbA(this.props.color)
                }}
                disabled={this.props.loading || false}
                onPress={this.onPress.bind(this)}
            >
                {this.props.loading || false ?
                    <ActivityIndicator
                        animated={true}
                    />
                    :

                    <Text
                        style={{
                            color: this.props.color,
                            textAlign: 'center',
                            fontSize: 24,
                            margin: 5,
                            fontWeight: this.props.bold ?'bold':'normal',
                        }}
                    >
                        {this.props.title || "Play"}
                    </Text>
                }
            </TouchableOpacity>
        )
    }
}