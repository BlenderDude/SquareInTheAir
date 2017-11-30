import { AppRegistry } from 'react-native';
import App from './App';
import GameCenter from "react-native-game-center"

const leaderboardIdentifier="com.danielabdelsamed.SquareInTheAir.Leaderboard"
GameCenter.init({leaderboardIdentifier})


AppRegistry.registerComponent('SquareInTheAir', () => App);
