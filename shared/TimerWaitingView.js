import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

import styles from './styles';


// Minute and second hands can only have two digits.
const MAX_DIGITS = 2;


export default class TimerWaitingView extends Component {
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

  render() {
    return (
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
    );
  }
}
