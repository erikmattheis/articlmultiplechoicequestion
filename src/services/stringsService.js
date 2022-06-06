function highlightedSubstring(string_, subString, part) {

  if (!subString && part === 'prefix') {

    return string_;

  }

  if (!subString) {

    return '';

  }

  const position = noCaseIndexOf(string_, subString);

  if (!string_) {

    return false;

  }

  if (part === 'prefix') {

    return string_.slice(0, Math.max(0, position));

  }

  if (part === 'term') {

    return string_.substring(position, position + subString?.length);

  }

  if (part === 'suffix') {

    return string_.slice(Math.max(0, position + subString?.length));

  }

}

function noCaseIndexOf(string_, subString) {

  if (!string_ || !subString) {

    return false;

  }

  return string_.toLowerCase().indexOf(subString.toLowerCase());

}

function emphasizeSubstring(string_, subString, length_) {

  if (!string_ || !subString || !length_) {

    return false;

  }

  let position = string_.toLowerCase().indexOf(subString.toLowerCase());
  let result = position > length_ / 2
    ? `...${string_.substring(Math.floor(length_ / 2), length_ - 3)}${Math.ceil(length_ / 2)}`
    : string_;

  position = result.toLowerCase().indexOf(subString.toLowerCase());

  if (position < length_) result = `${result.substring(result.length - Math.ceil(length_ / 2), length_ - 3)}...`;

}

function toListWithOptionalConjuction(array, conj = '') {

  if (!array || array.length === 0 || !Array.isArray(array)) {

    return '';

  }

  return (
    array.slice(0, -1).join(', ') + (array.length > 1 ? ` ${conj} ` : '') + array[array.length - 1]
  );

}

export {
  highlightedSubstring, noCaseIndexOf, emphasizeSubstring, toListWithOptionalConjuction,
};
