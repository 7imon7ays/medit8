/**
 * Modified from
 * https://blog.richardkeller.net/how-to-build-a-meditation-timer-with-react-native/
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {
    Platform, 
    Text, 
    View,
    TouchableOpacity,
  } from 'react-native';

import Sound from 'react-native-sound';
// https://github.com/ocetnik/react-native-background-timer
import BackgroundTimer from 'react-native-background-timer';

import styles from './shared/styles';
import utils from './shared/utils';


const INITIAL_TEXT = '0:05';
const ONE_SEC_IN_MILLI = 1000;


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: INITIAL_TEXT,
      sessionInProgress: false,
      timersList: [5],
    };

    this.initializeSound();

    this.beginSession = this.beginSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
  }

  initializeSound() {
    Sound.setCategory('Playback');
    this.chimeSound = new Sound('chime.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        alert(JSON.stringify(error))
      }
    });
  }

  playTone() {
    this.chimeSound.play();
  }

  resetTimer() {
    this.setState({
      text: INITIAL_TEXT,
      sessionInProgress: false,
    });
    BackgroundTimer.stopBackgroundTimer();
  }

  startTimer() {
    this.countDown(this.unshiftTimers());
  }

  // Safely unshift first timer.
  unshiftTimers() {
    const oldState = this.state;
    this.setState({timersList: oldState.timersList.slice(1)});
    return oldState.timersList[0];
  }

  countDown(secondsRemaining) {
    BackgroundTimer.runBackgroundTimer(() => {
      const secondsHand = utils.getSecondsHand(secondsRemaining);
      const minutesHand = utils.getMinutesHand(secondsRemaining);
      let displayTimer = `${minutesHand}:${secondsHand}`;

      this.setState({
        text: displayTimer
      });

      if (secondsRemaining < 1) {
        this.stopSession();
        console.log(secondsRemaining);
        this.playTone();
      }
        secondsRemaining--;
    }, ONE_SEC_IN_MILLI);
  }

  beginSession() {
    this.playTone();
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


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.timer}>{this.state.text}</Text>
        { !this.state.sessionInProgress &&
          <TouchableOpacity style={styles.beginButton} onPress={this.beginSession}>
            <Text style={styles.colorWhite}>Begin</Text>
          </TouchableOpacity>
        }
        { this.state.sessionInProgress &&
          <TouchableOpacity style={styles.stopButton} onPress={this.stopSession}>
            <Text style={styles.colorWhite}>Stop</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }

  componentWillUmount() {
    this.chimeSound.release();
    BackgroundTimer.stopBackgroundTimer();
  }
}
