import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import styles from './styles';

const ButtonView = ({
  sessionInProgress,
  beginSession,
  stopSession,
}) => {
  return (
    <View>
      { !sessionInProgress &&
        <TouchableOpacity style={styles.beginButton} onPress={beginSession}>
          <Text style={styles.colorWhite}>BEGIN</Text>
        </TouchableOpacity>
      }

      { sessionInProgress &&
        <TouchableOpacity style={styles.stopButton} onPress={stopSession}>
          <Text style={styles.colorWhite}>STOP</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

export default ButtonView;
