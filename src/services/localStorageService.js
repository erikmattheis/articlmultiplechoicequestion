const set = function (name, val) {

  localStorage.setItem(
    name,
    val,
  );

  if (
    window.location.hostname === 'localhost'
    || window.location.hostname === '192.168.1.130'
  ) {

    // Chrome localhost bug
    localStorage.getItem(val);

  }

};
const get = function (item) {

  const val = localStorage.getItem(item);

  return val;

};
const clear = function () {

  return localStorage.clear();

};

export {
  set, get, clear,
};
