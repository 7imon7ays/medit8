const utils = {
  formatTimeRemaining: secondsRemaining => {
    const secondsHand = getSecondsHand(secondsRemaining);
    const minutesHand = getMinutesHand(secondsRemaining);
    return `${minutesHand}:${secondsHand}`;
  },

  textInputToNumber: text => {

    const numChars = text.split('')
      .filter(character => character >= '0' && character <= '9').
      join('');

    return numChars === '' ? 0 : parseInt(numChars);
  },
};

const getSecondsHand = secondsRemaining => {
  let secondsHand = secondsRemaining % 60;

  if (secondsHand === 0) {
    return '00';
  }
  if (secondsHand < 10) {
    return `0${secondsHand}`
  }

  return String(secondsHand);
};

const getMinutesHand = secondsRemaining => {
  // TODO: Prepend '0' when less than 10.
  return String(
    Math.floor(secondsRemaining / 60),
  );
};

export default utils;
