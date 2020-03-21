import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

import styles from './styles';
import utils from './utils';


export default class TimerView extends Component {
  render() {
    const timeRemainingText = utils.buildTimeRemainingText(
      this.props.secondsRemaining,
    );

    return (
      <View>
        { !this.props.sessionInProgress &&
          <TextInput style={styles.timer}
            keyboardType='numeric'
            onChangeText={this.props.handleEditTimer}
          >
            {timeRemainingText}
          </TextInput>
        }


        { this.props.sessionInProgress &&
          <Text style={styles.timer}>{timeRemainingText}</Text>
        }
      </View>
    );
  }
}
