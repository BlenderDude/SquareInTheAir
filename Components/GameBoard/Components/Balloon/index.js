import React, {Component} from 'react'
import {
    View,
    Animated,
    Dimensions,
    Platform,
    StyleSheet
} from 'react-native'
import TouchManager from "../../TouchManager/index";
import ReactNativeHaptic from 'react-native-haptic'
import Sound from 'react-native-sound'

//setInterval(()=>console.log(),100)

const SIZE = 55
const TOUCH_LEEWAY = 25

Sound.setCategory('Ambient')

export default class Balloon extends Component {
    state = {
        translateX: new Animated.Value(1000),
        translateY: new Animated.Value(1000),
        rotate: new Animated.Value(0),
    }

    componentWillMount() {
        this.sound = new Sound('pop.wav', Sound.MAIN_BUNDLE, (error) => {

        })
    }

    componentDidMount() {
        this.animate.bind(this)
        this.animate()
        this.mounted = true
    }


    componentWillUnmount() {
        this.mounted = false
    }

    x = Math.random() * (Dimensions.get('window').width - SIZE)
    y = 100
    vx = (Math.random() - 0.5) * 7
    vy = -11
    ax = 0
    ay = 0.15
    // x = 100
    // y = -100
    // vx = 0
    // vy = 0
    // ax = 0
    // ay = 0
    lastFrame = (new Date).getTime()
    shouldCalcTouch = true

    animate() {
        const physicsFrame = 8
        this.thisFrame = (new Date).getTime()

        const {x, y, vx, vy, ax, ay} = this

        if (y > 200) {
            if (this.mounted) this.props.death()
            return;
        }
        setTimeout(this.animate.bind(this), physicsFrame)

        Animated.timing(this.state.translateX, {
            toValue: x,
            duration: this.lastFrame - this.thisFrame,
            useNativeDriver: true,
        }).start()
        Animated.timing(this.state.translateY, {
            toValue: y,
            duration: this.lastFrame - this.thisFrame,
            useNativeDriver: true,
        }).start()

        const physicsMultiplier = (this.thisFrame - this.lastFrame) / 16
        this.lastFrame = this.thisFrame

        this.x += vx * physicsMultiplier
        this.y += vy * physicsMultiplier
        this.vx += ax * physicsMultiplier
        this.vy += ay * physicsMultiplier

        if (this.x < 0 || this.x + SIZE > Dimensions.get('window').width) {
            this.vx *= -1
            if (this.x <= 0) {
                this.x = 0
                Animated.decay(this.state.rotate, {
                    velocity: 0.05 * this.vy,
                    deceleration: 0.999,
                    useNativeDriver: true,
                }).start()
            } else {
                this.x = Dimensions.get('window').width - SIZE
                Animated.decay(this.state.rotate, {
                    velocity: -0.05 * this.vy,
                    deceleration: 0.999,
                    useNativeDriver: true,
                }).start()
            }
        }
        if (this.shouldCalcTouch) {
            TouchManager.getTouches().map((touch) => {
                if (!this.shouldCalcTouch)return;
                const touchX = touch.pageX
                const touchY = Dimensions.get('window').height - touch.pageY
                const withinX = (this.x - TOUCH_LEEWAY < touchX && touchX < this.x + SIZE + TOUCH_LEEWAY)
                const withinY = (-this.y - TOUCH_LEEWAY < touchY && touchY < -this.y + SIZE + TOUCH_LEEWAY)
                if (withinX && withinY) {
                    const boxX = this.x + (SIZE / 2)
                    const boxY = -this.y + (SIZE / 2)
                    const touchProportion = (Math.abs(Math.atan2(touchY - boxY, touchX - boxX) * (180 / Math.PI)) - 90) / -90
                    this.vx = -touchProportion * 5
                    this.vy = -4 * Math.abs((touchProportion - Math.sign(touchProportion))) - 7

                    if (Platform.OS === "ios") {
                        ReactNativeHaptic.generate('impact')
                    }
                    this.sound.play()
                    Animated.decay(this.state.rotate, {
                        velocity: -touchProportion,
                        deceleration: 0.999,
                        useNativeDriver: true,
                    }).start()
                    this.shouldCalcTouch = false
                    clearTimeout(this.calcTouchTimeout)
                    this.calcTouchTimeout = setTimeout(() => this.shouldCalcTouch = true, 200)
                }
            })

        }
    }

    r = Math.random() * 255
    g = Math.random() * 255
    b = Math.random() * 255

    render() {
        return (
            <Animated.View
                style={{
                    height: SIZE,
                    width: SIZE,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: `rgb(${this.r},${this.g},${this.b})`,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: `rgb(${255 - this.r},${255 - this.g},${255 - this.b})`,
                    transform: [
                        {translateX: this.state.translateX},
                        {translateY: this.state.translateY},
                        {
                            rotate: this.state.rotate.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "1deg"]
                            })
                        },
                    ]
                }}
            />
        )
    }
}