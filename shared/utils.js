const getMinutesHand = secondsRemaining => {
  const minutesHand = Math.floor(secondsRemaining / 60);
  if (minutesHand < 10) {
    return `0${minutesHand}`
  }

  return String(minutesHand);
};

const getSecondsHand = secondsRemaining => {
  const secondsHand = secondsRemaining % 60;

  if (secondsHand < 10) {
    return `0${secondsHand}`
  }

  return String(secondsHand);
};

const utils = {
  getMinutesHand,
  getSecondsHand,

  buildTimeRemainingText: secondsRemaining => {
    const minutesHand = getMinutesHand(secondsRemaining);
    const secondsHand = getSecondsHand(secondsRemaining);
    return `${minutesHand}:${secondsHand}`;
  },

  textInputToNumber: text => {

    const numChars = text.split('')
      .filter(character => character >= '0' && character <= '9').
      join('');

    return numChars === '' ? 0 : parseInt(numChars);
  },
};

export default utils;
