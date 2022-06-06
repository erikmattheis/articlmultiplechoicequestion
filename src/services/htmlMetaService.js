import store from '@/store';

const setTitle = function (documentTitle) {

  document.title = documentTitle;

};
const setMetaDescription = function (metaDescription) {

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

};
const setTitleAndDescription = function (object) {

  setTitle(object.title);

  setMetaDescription(object.description);

  store.dispatch('metas/setMetaDescriptionAndDocumentTitle', {
    documentTitle: object.title,
    metaDescription: object.description,
  });

};

export { setTitleAndDescription, setTitle, setMetaDescription };
