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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Sound from 'react-native-sound';
// https://github.com/ocetnik/react-native-background-timer
import BackgroundTimer from 'react-native-background-timer';

import ButtonView from './shared/ButtonView';
import TimerView from './shared/TimerView';
import styles from './shared/styles';
import utils from './shared/utils';


const ONE_SEC_IN_MILLI = 1000;
const DEFAULT_TIME_MIN = 1;
const DEFAULT_MN_SECS = {minutesNum: 0, secondsNum: 5};


export default class App extends Component {
  constructor(props) {
    super(props);

    this._interval = null;

    this.state = {
      ...DEFAULT_MN_SECS,
      secondsRemaining: 0,
      sessionInProgress: false,
      timersList: [],
    };

    this.initializeSound();

    this.beginSession = this.beginSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.handleEditMinutes = this.handleEditMinutes.bind(this);
    this.handleEditSeconds = this.handleEditSeconds.bind(this);
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
    const secondsRemaining = this.state.minutesNum*60 + this.state.secondsNum;
    this.setState({secondsRemaining});

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
      sessionInProgress: false,
    });
    this.clearTimerInterval()
  }

  handleEditMinutes(text) {
    this._handleEdit(text, 'minutesNum');
  }

  handleEditSeconds(text) {
    this._handleEdit(text, 'secondsNum');
  }

  _handleEdit(text, hand) {
    const asNumber = utils.textInputToTwoDigitNumber(text);
    this.setState({[hand]: asNumber});
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

        <
          TimerView
          minutesNum={this.state.minutesNum}
          secondsNum={this.state.secondsNum}
          handleEditMinutes={this.handleEditMinutes}
          handleEditSeconds={this.handleEditSeconds}
          secondsRemaining={this.state.secondsRemaining}
          sessionInProgress={this.state.sessionInProgress}
        />

        <
          ButtonView
          beginSession={this.beginSession}
          stopSession={this.stopSession}
          sessionInProgress={this.state.sessionInProgress}
        />

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
