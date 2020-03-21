const utils = {
  getSecondsHand: secondsRemaining => {
    let secondsHand = secondsRemaining % 60;

    if (secondsHand === 0) {
      return '00';
    }
    if (secondsHand < 10) {
      return `0${secondsHand}`
    }

    return secondsHand;
  },

  getMinutesHand: secondsRemaining => {
    return Math.floor(secondsRemaining / 60);
  },

  textInputToNumber: text => {
    const numChars = text.split('')
      .filter(character => character >= '0' && character <= '9').
      join('');
    return parseInt(numChars);
  },
};

export default utils;
