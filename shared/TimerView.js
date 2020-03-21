import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

import styles from './styles';
import utils from './utils';


const MAX_DIGITS = 2;


export default class TimerView extends Component {
  render() {
    const minutesHand = utils.getMinutesHand(this.props.minutesNum);
    const secondsHand = utils.getSecondsHand(this.props.secondsNum);

    const timeRemainingText = utils.buildTimeRemainingText(
      this.props.secondsRemaining,
    );

    return (
      <View>

        { !this.props.sessionInProgress &&
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.timer}
              keyboardType='numeric'
              onChangeText={this.props.handleEditMinutes}
              maxLength={MAX_DIGITS}
            >
              {minutesHand}
            </TextInput>
            <Text style={styles.timer}>:</Text>
            <TextInput style={styles.timer}
              keyboardType='numeric'
              onChangeText={this.props.handleEditSeconds}
              maxLength={MAX_DIGITS}
            >
              {secondsHand}
            </TextInput>
          </View>
        }


        { this.props.sessionInProgress &&
          <Text style={styles.timer}>{timeRemainingText}</Text>
        }

      </View>
    );
  }
}
