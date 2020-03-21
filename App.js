/**
 * Modified from
 * https://blog.richardkeller.net/how-to-build-a-meditation-timer-with-react-native/
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Sound from 'react-native-sound';
// https://github.com/ocetnik/react-native-background-timer
import BackgroundTimer from 'react-native-background-timer';

import TimerView from './shared/TimerView';
import styles from './shared/styles';
import utils from './shared/utils';


const ONE_SEC_IN_MILLI = 1000;
const DEFAULT_TIME_MIN = 1;


export default class App extends Component {
  constructor(props) {
    super(props);

    this._interval = null;

    this.state = {
      secondsRemaining: 5,
      sessionInProgress: false,
      timersList: [],
    };

    this.initializeSound();

    this.beginSession = this.beginSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.handleEditTimer = this.handleEditTimer.bind(this);
  }

  initializeSound() {
    Sound.setCategory('Playback');
    this.chimeSound = new Sound('chime.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        alert(JSON.stringify(error))
      }
    });
  }

  chime() {
    this.chimeSound.play();
  }

  startTimer() {
    this._interval = BackgroundTimer.setInterval(() => {
      this.setState({secondsRemaining: this.state.secondsRemaining - 1});

      if (this.state.secondsRemaining < 1) {
        this.stopSession();
        this.chime();
      }
    }, ONE_SEC_IN_MILLI);
  }

  // Safely unshift first timer.
  // TODO: Currently unused.
  unshiftTimers() {
    const oldState = this.state;
    this.setState({timersList: oldState.timersList.slice(1)});
    return oldState.timersList[0];
  }

  beginSession() {
    this.chime();
    this.startTimer();

    this.setState({
      sessionInProgress: true
    })
  }

  stopSession() {
    this.resetTimer();
    this.setState({
      sessionInProgress: false
    });
  }

  resetTimer() {
    this.setState({
      secondsRemaining: 0,
      sessionInProgress: false,
    });
    this.clearTimerInterval()
  }

  handleEditTimer(text) {
    const asNumber = utils.textInputToNumber(text);
    this.setState({secondsRemaining: asNumber * 60});
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

        <
          TimerView
          handleEditTimer={this.handleEditTimer}
          secondsRemaining={this.state.secondsRemaining}
          sessionInProgress={this.state.sessionInProgress}
        />

        { !this.state.sessionInProgress &&
          <
            TouchableOpacity
            style={styles.beginButton} onPress={this.beginSession}
          >
            <Text style={styles.colorWhite}>BEGIN</Text>
          </TouchableOpacity>
        }
        { this.state.sessionInProgress &&
          <
            TouchableOpacity
            style={styles.stopButton}
            onPress={this.stopSession}
          >
            <Text style={styles.colorWhite}>STOP</Text>
          </TouchableOpacity>
        }
        </View>
      </TouchableWithoutFeedback>
    );
  }

  componentWillUmount() {
    this.chimeSound.release();
    this.clearTimerInterval();
  }

  clearTimerInterval() {
    BackgroundTimer.clearInterval(this._interval);
  }
}
