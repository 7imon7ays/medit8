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

import styles from './shared/styles';
import utils from './shared/utils';


const ONE_SEC_IN_MILLI = 1000;


export default class App extends Component {
  constructor(props) {
    super(props);

    this._interval = null;  // Placeholder until time starts.

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
    BackgroundTimer.clearInterval(this._interval);
  }

  handleEditTimer(text) {
    const asNumber = utils.textInputToNumber(text);
    this.setState({secondsRemaining: asNumber});
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

        <TextInput
          style={styles.timer}
          keyboardType='numeric'
          onChangeText={this.handleEditTimer}
        >{utils.formatTimeRemaining(this.state.secondsRemaining)}
        </TextInput>

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
    BackgroundTimer.stopBackgroundTimer();
  }
}
