export default {
  namespaced: true,

  state() {

    return {
      user: undefined,
      userId: undefined,
      userFullName: undefined,
      isEmailVerified: undefined,
    };

  },

  mutations: {
    SET_USER(state, payload) {

      state.user = payload;

    },
  },

  actions: {
    setUser(context, payload) {

      context.commit('SET_USER', payload);

    },
  },
  getters: {
    user(state) {

      return state.user;

    },
    userId(state) {

      return state.user.id;

    },

    userFullName(state) {

      return `${state.user.nameFirst} ${state.user.nameLast}`;

    },

    isEmailVerified(state) {

      return state.user.isEmailVerified;

    },
  },
};
