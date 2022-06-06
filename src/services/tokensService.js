import { app } from '@/main.js';
import store from '@/store';

const getVueInstanceContext = function () {

  return app.config.globalProperties;

};
const updateSeconds = function () {

  console.log('updateSeconds');
  this.now = Math.round(Date.now() / 1000);

};

let interval;

const isLoggedIn = function () {

  const currentYear = new Date().getUTCFullYear();
  const currentTime = new Date().setUTCFullYear(currentYear);

  if (!interval) {

    interval = setInterval(updateSeconds, 2000);

  }

  const expires = Number(getAccessTokenExpires());

  console.log(expires, 'expires');
  console.log(currentTime, 'currentTime');
  console.log(`${expires > currentTime}`, 'expires > currentTime');
  clearInterval(interval);

  return expires > currentTime;

};
const getAccessTokenExpires = function () {

  const accessTokenExpires = getVueInstanceContext().$cookies.get('accessTokenExpires');

  if (accessTokenExpires) {

    store.dispatch('tokens/accessTokenExpires', accessTokenExpires);

  }

  return accessTokenExpires;

};
const getAccessTokenValue = function () {

  const accessTokenValue = getVueInstanceContext().$cookies.get('accessTokenValue');

  if (accessTokenValue) {

    store.dispatch('tokens/accessTokenValue', accessTokenValue);

  }

  return accessTokenValue;

};
const getRefreshTokenExpires = function () {

  const refreshTokenExpires = getVueInstanceContext().$cookies.get(
    'refreshTokenExpires',
  );

  if (refreshTokenExpires) {

    store.dispatch('tokens/refreshTokenExpires', refreshTokenExpires);

  }

  return refreshTokenExpires;

};
const getRefreshTokenValue = function () {

  const refreshTokenValue = getVueInstanceContext().$cookies.get('refreshTokenValue');

  if (refreshTokenValue) {

    store.dispatch('tokens/refreshTokenValue', refreshTokenValue);

  }

  return refreshTokenValue;

};
const setTokensInVuex = function (val) {

  if (val?.access?.token) {

    store.dispatch('tokens/accessTokenValue', val.access.token);
    store.dispatch('tokens/accessTokenExpires', val.access.expires);
    store.dispatch('tokens/refreshTokenValue', val.refresh.token);
    store.dispatch('tokens/refreshTokenExpires', val.refresh.expires);

  }

};
const setTokensInLocalStorage = function (val) {

  if (val?.access?.token) {

    const vue = getVueInstanceContext();

    vue.$cookies.set('accessTokenValue', val.access.token);
    vue.$cookies.set('accessTokenExpires', val.access.expires);
    vue.$cookies.set('refreshTokenValue', val.refresh.token);
    vue.$cookies.set('refreshTokenExpires', val.refresh.expires);

  }

};
const convertStringDatesToMS = function (serverResult) {

  if (serverResult?.data?.tokens) {

    const result = JSON.parse(JSON.stringify(serverResult));

    result.data.tokens.access.expires = Date.parse(
      result.data.tokens.access.expires,
    );
    result.data.tokens.refresh.expires = Date.parse(
      result.data.tokens.refresh.expires,
    );

    return result;

  }

  return {};

};
const setTokens = function setTokens(response) {

  const result = convertStringDatesToMS(response);

  setTokensInLocalStorage(result.data.tokens);
  setTokensInVuex(result.data.tokens);

};

export {
  isLoggedIn,
  getAccessTokenExpires,
  getAccessTokenValue,
  getRefreshTokenExpires,
  getRefreshTokenValue,
  setTokensInVuex,
  setTokensInLocalStorage,
  convertStringDatesToMS,
  setTokens,
};
