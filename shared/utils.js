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
};

export default utils;
