import {StyleSheet} from 'react-native';


const styles = StyleSheet.create({
  timersListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  timerContainer: {
    height: 500,
  },
  timerListContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  timer: {
    fontSize: 80,
    textAlign: 'center',
  },
  beginButton: {
    margin: 40,
    padding: 40,
    backgroundColor: '#4CAF50',
    width: '80%',
  },
  stopButton: {
    margin: 40,
    padding: 40,
    backgroundColor: '#F44336',
    width: '80%',
  },
  colorWhite: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 26
  },
})


export default styles;
