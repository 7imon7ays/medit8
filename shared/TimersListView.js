import React, {Component} from 'react';
import {FlatList, View} from 'react-native';

import TimerView from './TimerView';
import styles from './styles';


export default class TimersListView extends Component {
  buildTimer(minutesNum, secondsNum, idx) {
    return (
      <
        TimerView
        idx={idx}
        minutesNum={minutesNum}
        secondsNum={secondsNum}
        currentTimerIdx={this.props.currentTimerIdx}
        handleEditMinutes={this.props.handleEditMinutes}
        handleEditSeconds={this.props.handleEditSeconds}
        secondsRemaining={this.props.secondsRemaining}
        sessionInProgress={this.props.sessionInProgress}
      />
    );
  }

  render() {
    return (
      <View style={styles.timerContainer}>
        <FlatList
          contentContainerStyle={styles.timerListContentContainer}
          data={this.props.timersArr}
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
}
