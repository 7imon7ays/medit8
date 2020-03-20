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


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '1:00',
      sessionInProgress: false
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
      text: '1:00',
      sessionInProgress: false
    });
    BackgroundTimer.stopBackgroundTimer();
  }

  startTimer() {
    let currSeconds = 60;

    BackgroundTimer.runBackgroundTimer(() => {
      let secondHand = currSeconds % 60;
      secondHand = (secondHand === 0) ? '00' : secondHand;
      secondHand = (secondHand !== '00' && secondHand < 10) ? `0${secondHand}` : secondHand;

      let displayTimer = `${Math.floor(currSeconds/60)}:${secondHand}`;

      this.setState({
        text: displayTimer
      });
      if (currSeconds === 0) {
        this.stopSession();
        this.playTone();
      }
        currSeconds--;
    }, 1000);
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
        <View style={styles.header}>
          <Text style={styles.headerText}>Meditation Timer</Text>
        </View>
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
