import {StyleSheet} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  timer: {
    fontSize: 80,
    textAlign: 'center',
    margin: 10,
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
  header: {
    position: 'absolute',
    top: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#4CAF50'
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    paddingTop: 15,
    paddingLeft: 10,
    textAlign: 'center'
  },
})


export default styles;
