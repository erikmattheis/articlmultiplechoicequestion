import store from '@/store';

const setTitleAndDescription = function (object) {

  store.dispatch('metas/setMetaDescriptionAndDocumentTitle', {
    documentTitle: object.title,
    metaDescription: object.description,
  });

};

export {
  setTitleAndDescription,
};
