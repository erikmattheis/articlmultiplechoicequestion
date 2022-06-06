export default {
  namespaced: true,
  state() {

    return {
      metaDescription: undefined,
      documentTitle: undefined,
    };

  },
  mutations: {
    SET_DOCUMENT_TITLE(state, payload) {

      state.documentTitle = payload;

    },
    SET_META_DESCRIPTION(state, payload) {

      state.metaDescription = payload;

    },
  },
  actions: {
    setMetaDescriptionAndDocumentTitle(
      context,
      {
        documentTitle, metaDescription,
      },
    ) {

      context.commit('SET_DOCUMENT_TITLE', documentTitle);
      context.commit('SET_META_DESCRIPTION', metaDescription);
      document.title = documentTitle;

      let meta = document.querySelector('meta[name="description"]');

      if (!meta) {

        meta = document.createElement('meta');
        meta.name = 'description';
        document
          .getElementsByTagName('head')[0]
          .appendChild(meta)
          .setAttribute('content', metaDescription);

      } else {

        meta.content = metaDescription;

      }

    },
  },
  getters: {
    documentTitle(state) {

      return state.documentTitle;

    },
    metaDescription(state) {

      return state.metaDescription;

    },
  },
};
