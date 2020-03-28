import React, {Component} from 'react';
import {Text, View} from 'react-native';

import TimerWaitingView from './TimerWaitingView';
import styles from './styles';
import utils from './utils';


export default class TimerView extends Component {
  isRunning() {
    return this.props.sessionInProgress && this.props.idx === 0;
  }

  render() {
    const timeRemainingText = utils.buildTimeRemainingText(
      this.props.secondsRemaining,
    );

    let timerEl = <Text style={styles.timer}>{timeRemainingText}</Text>;

    if (!this.isRunning()) {
      timerEl = <TimerWaitingView
        minutesNum={this.props.minutesNum}
        secondsNum={this.props.secondsNum}
        idx={this.props.idx}
        handleEditMinutes={this.props.handleEditMinutes}
        handleEditSeconds={this.props.handleEditSeconds}
      />
    }

    return (
      <View>
        {timerEl}
      </View>
    );
  }
}
