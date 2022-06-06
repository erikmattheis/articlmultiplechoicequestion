function charCounts(val) {

  return {
    numUpper: val.length - val.replace(/[A-Z]/g, '').length,
    numLower: val.length - val.replace(/[a-z]/g, '').length,
    numDigit: val.length - val.replace(/[0-9]/g, '').length,
    numSpecial: val.length - val.replace(/\W|_/g, '').length,
  };

}

function scoreChars =  (val) {

  if (!val) {

    return 0;

  }

  const chars = charCounts(val);
  const a = chars.numUpper > 0 ? 1 : 0;
  const b = chars.numLower > 0 ? 1 : 0;
  const c = chars.numDigit > 0 ? 1 : 0;
  const d = chars.numSpecial > 0 ? 1 : 0;

  return a + b + c + d;

};
const validateEmail = function (email) {

  if (!email) {

    return false;

  }

  return email.match(

    // eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  );

};

export { scoreChars, validateEmail };
