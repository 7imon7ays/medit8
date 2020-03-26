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
  FlatList,
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
const DEFAULT_MN_SECS = {minutesNum: 0, secondsNum: 5};


export default class App extends Component {
  constructor(props) {
    super(props);

    this._interval = null;

    this.state = {
      secondsRemaining: 0,
      sessionInProgress: false,
      timersList: [DEFAULT_MN_SECS],
    };

    this.initializeSound();

    this.beginSession = this.beginSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.handleEditMinutes = this.handleEditMinutes.bind(this);
    this.handleEditSeconds = this.handleEditSeconds.bind(this);
    this.handleAddTimer = this.handleAddTimer.bind(this);
    this.buildTimer = this.buildTimer.bind(this);
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
    const currentTimer = this.state.timersList[0];
    const secondsRemaining = currentTimer.minutesNum*60 + currentTimer.secondsNum;
    this.setState({secondsRemaining});

    this._interval = BackgroundTimer.setInterval(() => {
      this.setState({secondsRemaining: this.state.secondsRemaining - 1});

      if (this.state.secondsRemaining < 1) {
        this.stopSession();
        this.chime();
      }
    }, ONE_SEC_IN_MILLI);
  }

  addTimer() {
    this.setState({
      timersList: this.state.timersList.concat([DEFAULT_MN_SECS]),
    });
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
    const asNumber = utils.textInputToTwoDigitNumber(text);

    const oldList = this.state.timersList;
    const oldTimer = oldList[idx];
    // Copy the old timer and overwrite the given hand.
    const newTimer = {...oldTimer, [hand]: asNumber};
    // Replace the timer at the given index.
    const newList = oldList.slice(0, idx).concat(
      [newTimer], oldList.slice(idx + 1),
    );
    this.setState({timersList: newList});
  }

  handleAddTimer() {
    this.addTimer();
  }

  buildTimers() {
    return (
      <View style={styles.timerContainer}>
        <FlatList
          contentContainerStyle={styles.timerListContentContainer}
          data={this.state.timersList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={
            (data) => {
              return this.buildTimer(
                data.item.minutesNum,
                data.item.secondsNum,
                data.index,
              );
            }
          }
        />
      </View>
    );
  }

  buildTimer(minutesNum, secondsNum, idx) {
    return <
        TimerView
        idx={idx}
        minutesNum={minutesNum}
        secondsNum={secondsNum}
        handleEditMinutes={this.handleEditMinutes}
        handleEditSeconds={this.handleEditSeconds}
        secondsRemaining={this.state.secondsRemaining}
        sessionInProgress={this.state.sessionInProgress}
      />
  }

  render() {
    const TimerFlatList = this.buildTimers();

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.timersListContainer}>

        {TimerFlatList}

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
