export default {
  namespaced: true,

  state() {

    return {
      accessTokenExpires: undefined,
      accessTokenValue: undefined,
      refreshTokenExpires: undefined,
      refreshTokenValue: undefined,
    };

  },

  mutations: {
    SET_ACCESS_TOKEN_VALUE(state, payload) {

      state.accessTokenValue = payload;

    },

    SET_ACCESS_TOKEN_EXPIRES(state, payload) {

      state.accessTokenExpires = payload;

    },

    SET_REFRESH_TOKEN_VALUE(state, payload) {

      state.refreshTokenValue = payload;

    },

    SET_REFRESH_TOKEN_EXPIRES(state, payload) {

      state.refreshTokenExpires = payload;

    },
  },

  actions: {
    logout(context) {

      context.commit('SET_ACCESS_TOKEN_EXPIRES', '');
      context.commit('SET_ACCESS_TOKEN_VALUE', '');
      context.commit('SET_REFRESH_TOKEN_EXPIRES', '');
      context.commit('SET_REFRESH_TOKEN_VALUE', '');

    },

    accessTokenExpires(context, payload) {

      if (payload) {

        context.commit('SET_ACCESS_TOKEN_EXPIRES', payload);

      }

    },

    accessTokenValue(context, payload) {

      if (payload) {

        context.commit('SET_ACCESS_TOKEN_VALUE', payload);

      }

    },

    refreshTokenExpires(context, payload) {

      if (payload) {

        context.commit('SET_REFRESH_TOKEN_EXPIRES', payload);

      }

    },

    refreshTokenValue(context, payload) {

      if (payload) {

        context.commit('SET_REFRESH_TOKEN_VALUE', payload);

      }

    },
  },

  getters: {
    isLoggedIn(state) {

      const now = Date.now();

      return state.accessTokenExpires > now;

    },

    accessTokenExpires(state) {

      return state.accessTokenExpires;

    },

    accessTokenValue(state) {

      return state.accessTokenValue;

    },

    refreshTokenExpires(state) {

      return state.refreshTokenExpires;

    },

    refreshTokenValue(state) {

      return state.refreshTokenValue;

    },
  },
};
