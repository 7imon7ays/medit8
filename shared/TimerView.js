import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

import styles from './styles';
import utils from './utils';


export default class TimerView extends Component {
  render() {
    const minutesHand = utils.getMinutesHand(this.props.secondsRemaining);
    const secondsHand = utils.getSecondsHand(this.props.secondsRemaining);
    const timeRemainingText = utils.buildTimeRemainingText(this.props.secondsRemaining);

    return (
      <View>

        { !this.props.sessionInProgress &&
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.timer}
              keyboardType='numeric'
              onChangeText={this.props.handleEditTimer}
            >
              {minutesHand}
            </TextInput>
            <Text style={styles.timer}>:</Text>
            <TextInput style={styles.timer}
            keyboardType='numeric'
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
