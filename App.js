/**
 * Modified from
 * https://blog.richardkeller.net/how-to-build-a-meditation-timer-with-react-native/
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {List, Map} from 'immutable';
import Sound from 'react-native-sound';
// https://github.com/ocetnik/react-native-background-timer
import BackgroundTimer from 'react-native-background-timer';

import ButtonView from './shared/ButtonView';
import TimerView from './shared/TimerView';
import TimersListView from './shared/TimersListView';
import styles from './shared/styles';
import utils from './shared/utils';


const DEFAULT_MN_SECS = Map({minutesNum: 0, secondsNum: 5});
const INITIAL_TIMER_IDX = -1;  // Start negative so we're always adding 1.
const ONE_SEC_IN_MILLI = 1000;


export default class App extends Component {
  constructor(props) {
    super(props);

    this._interval = null;

    this.state = {
      currentTimerIdx: INITIAL_TIMER_IDX,
      secondsRemaining: 0,
      sessionInProgress: false,
      timersList: List([DEFAULT_MN_SECS]),
    };

    this.initializeSound();

    this.beginSession = this.beginSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.handleEditMinutes = this.handleEditMinutes.bind(this);
    this.handleEditSeconds = this.handleEditSeconds.bind(this);
    this.handleAddTimer = this.handleAddTimer.bind(this);
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

  runTimers() {
    this._canAdvanceTimer();

    this._interval = BackgroundTimer.setInterval(() => {
      if (this.state.secondsRemaining < 1) {
        this.chime();
        if (!this._canAdvanceTimer()) {
          // TODO: Session is over. Chime with a different sound.
          this.stopSession();
          return;
        }
      }
      this._tick();
    }, ONE_SEC_IN_MILLI);
  }

  _canAdvanceTimer() {
    const currentTimerIdx = this.state.currentTimerIdx + 1;
    this.setState({currentTimerIdx});

    if (currentTimerIdx >= this.state.timersList.count()) {
      return false;
    }

    let currentTimer = this.state.timersList.get(currentTimerIdx),
        minsRemaining = currentTimer.get('minutesNum'),
        secsRemaining = currentTimer.get('secondsNum');

    this.setState({
      secondsRemaining: utils.addTimeRemaining(
        minsRemaining, secsRemaining,
      ),
    });

    return true;
  }

  _tick() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1});
  }

  addTimer() {
    this.setState({
      timersList: this.state.timersList.push(DEFAULT_MN_SECS),
    });
  }

  // TODO: Button to remove any timer that isn't the first.

  beginSession() {
    this.chime();
    this.runTimers();

    this.setState({
      sessionInProgress: true
    })
  }

  // TODO: Support pausing sessions.
  stopSession() {
    this.resetTimer();
    this.setState({
      currentTimerIdx: INITIAL_TIMER_IDX,
      sessionInProgress: false
    });
  }

  resetTimer() {
    this.clearTimerInterval()
  }

  handleEditMinutes(text, idx) {
    this._handleEdit(text, idx, 'minutesNum');
  }

  handleEditSeconds(text, idx) {
    this._handleEdit(text, idx, 'secondsNum');
  }

  // Update the given hand for the timer at the given index.
  _handleEdit(text, idx, hand) {
    if (this.state.sessionInProgress) {
      // Extra precaution. Timers don't handle touches during a session.
      // Later maybe timers that haven't yet started can be edited mid-session.
      return;
    }
    const asNumber = utils.textInputToTwoDigitNumber(text),
          newTimer = this.state.timersList.get(idx).set(hand, asNumber),
          timersList = this.state.timersList.set(idx, newTimer);

    this.setState({timersList});
  }

  handleAddTimer() {
    this.addTimer();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.timersListContainer}>

        <
          TimersListView
          timersArr={this.state.timersList.toJS()}
          currentTimerIdx={this.state.currentTimerIdx}
          handleEditSeconds={this.handleEditSeconds}
          handleEditMinutes={this.handleEditMinutes}
          secondsRemaining={this.state.secondsRemaining}
          sessionInProgress={this.state.sessionInProgress}
        />

        <Button title='+' style={styles.timer} onPress={this.handleAddTimer}/>

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
