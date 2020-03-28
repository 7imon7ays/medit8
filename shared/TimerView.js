import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

import styles from './styles';
import utils from './utils';


// Minute and second hands can only have two digits.
const MAX_DIGITS = 2;


export default class TimerView extends Component {
  constructor(props) {
    super(props);
    this.handleEditMinutes = this.handleEditMinutes.bind(this);
    this.handleEditSeconds = this.handleEditSeconds.bind(this);
  }

  handleEditMinutes(text) {
    this.props.handleEditMinutes(text, this.props.idx);
  }

  handleEditSeconds(text) {
    this.props.handleEditSeconds(text, this.props.idx);
  }

  isCurrentTimer() {
    return this.props.idx === 0;
  }

  render() {
    const timeRemainingText = utils.buildTimeRemainingText(
      this.props.secondsRemaining,
    );

    const isRunning = this.props.sessionInProgress && this.isCurrentTimer();

    return (
      <View>

        {
          !isRunning &&
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.timer}
              keyboardType='numeric'
              onChangeText={this.handleEditMinutes}
              maxLength={MAX_DIGITS}
            >
              {this.props.minutesNum}
            </TextInput>
            <Text style={styles.timer}>:</Text>
            <TextInput style={styles.timer}
              keyboardType='numeric'
              onChangeText={this.handleEditSeconds}
              maxLength={MAX_DIGITS}
            >
              {this.props.secondsNum}
            </TextInput>
          </View>
        }

        {
          isRunning &&
          <Text style={styles.timer}>{timeRemainingText}</Text>
        }

      </View>
    );
  }
}
