function copyToClipboard(index) {

  let finalSelector = '';

  switch (index) {

    case 1:
      finalSelector = 'title';

      break;

    case 2:
      finalSelector = 'authors';

      break;

    case 3:
      finalSelector = 'affiliation';

      break;

    case 4:
      finalSelector = 'journal';

      break;

    case 5:
      finalSelector = 'year';

      break;

    case 6:
      finalSelector = 'month';

      break;

    case 7:
      finalSelector = 'abstract';

      break;

    default:
      break;

  }

  // getting text from and ID
  const copyText = document.getElementById(String(finalSelector)).innerHTML;
  // creating textarea of html
  const input = document.createElement('textarea');

  // adding p tag text to textarea
  input.value = copyText;

  document.body.append(input);

  input.select();

  document.execCommand('Copy');

  // removing textarea after copy
  input.remove();

}

// Parse the ID from the URL
function getId(url) {

  let id;

  if (url.charAt(url.length - 1) === '/') {

    id = url.slice(0, Math.max(0, url.length - 1));

  }

  id = url.slice(Math.max(0, url.lastIndexOf('/') + 1));

  return id;

}

function getDB(url) {

  try {

    if (url.includes('pmc')) return 'pmc';

  } catch (error) {

    this.$store.dispatch('errors/setError', error);

  }

  try {

    if (url.includes('pubmed.')) return 'pubmed';

  } catch (error) {

    this.$store.dispatch('errors/setError', error);

  }

  return '';

}

//
// function clearTable(result) {
// result.title = "";
// result.authors = "";
// result.affiliation = "";
// result.journal = "";
// result.year = "";
// result.month = "";
// result.abstract = "";
// result.authors = "";
// }
//
// Handle the Async fetch of Pubmed Data
function api(surl) {

  const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  const mode = 'efetch';
  const database = getDB(surl);
  const id = getId(surl);
  const type = 'xml';
  const request = new Request(`${baseUrl}${mode}.fcgi?db=${database}&id=${id}&rettype=abstract&retmode=${type}`);

  return fetch(request).then(// results returns XML. lets cast this to a string, then create
    // a new DOM object out of it!
    (results) => results.text().then((string_) => {

      const responseDocument = new DOMParser().parseFromString(string_, 'application/xml');
      const result = {
        authors: '',
      };

      switch (database) {

        case 'pmc':
          try {

            result.title = responseDocument.querySelectorAll('article-title')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            const authors = responseDocument.querySelectorAll('contrib');

            authors.forEach((element) => {

              if (element.querySelector('surname').textContent !== 'undefined') {

                result.authors += element.querySelector('surname') ? `${element.querySelector('surname').textContent} ` : '';

                result.authors += element.querySelector('given-names') ? `${element.querySelector('given-names').textContent} ` : '';

                result.authors += element.querySelector('degrees') ? `${element.querySelector('degrees').textContent}<br><br>` : '';

              }

            });

          } catch (error) {

            console.error(error);

          }

          try {

            const temporary = responseDocument.querySelectorAll('aff');

            temporary.forEach((element) => {

              result.affiliation += `${element.textContent}<br><br>`;

            });

          } catch (error) {

            console.error(error);

          }

          try {

            result.journal = responseDocument.querySelectorAll('journal-title')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.year = responseDocument.querySelectorAll('pub-date')[0].querySelectorAll('year')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.month = responseDocument.querySelectorAll('pub-date')[0].querySelectorAll('month')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.abstract = responseDocument.querySelectorAll('abstract')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          break;

        case 'pubmed':
          try {

            result.title = responseDocument.querySelectorAll('ArticleTitle')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            const authors = responseDocument.querySelectorAll('Author');

            authors.forEach((element) => {

              result.authors += element.querySelector('LastName') ? `${element.querySelector('LastName').textContent} ` : '';

              result.authors += element.querySelector('ForeName') ? `${element.querySelector('ForeName').textContent},` : '<br><br>';

            });

          } catch (error) {

            console.error(error);

          }

          try {

            result.affiliation = responseDocument.querySelectorAll('Affiliation')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.journal = responseDocument.querySelectorAll('Title')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.year = responseDocument.querySelectorAll('PubMedPubDate')[0].querySelectorAll('Year')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.month = responseDocument.querySelectorAll('PubMedPubDate')[0].querySelectorAll('Month')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          try {

            result.abstract = responseDocument.querySelectorAll('Abstract')[0].textContent;

          } catch (error) {

            console.error(error);

          }

          break;

        default:
          throw new Error('Unknown function called in scraper');

      }

      return result;

    }),
  );

}

function scrape(surl) {

  const url = `https://cors-anywhere.herokuapp.com/${surl}`;
  const database = getDB(surl);

  return fetch(url).then((response) => response.text()).then(function (html) {

    const parser = new DOMParser();
    const responseDocument = parser.parseFromString(html, 'text/html');
    const result = {
    };

    switch (database) {

      case 'pmc':
        try {

          result.title = responseDocument.querySelectorAll('h1[class="content-title"]')[0].textContent;

          result.authors = responseDocument.querySelectorAll('[class="contrib-group fm-author"]') ? responseDocument.querySelectorAll('[class="contrib-group fm-author"]')[0].textContent : '';

          const temporary = responseDocument.querySelectorAll('[class="fm-affl"]');

          temporary.forEach((element) => {

            result.affiliation += `${element.textContent}<br><br>`;

          });

          result.journal = responseDocument.querySelectorAll('li[class="archive"]')[0].textContent;

          result.year = responseDocument.querySelectorAll('li[class="issue-page"]')[0].textContent;

          result.abstract = responseDocument.querySelectorAll('[class="tsec sec"]')[0].textContent;

        } catch (error) {

          console.error(error);

        }

        break;

      case 'pubmed':
        try {

          result.title = responseDocument.querySelectorAll('[class="heading-title"]')[0].textContent;

          result.authors = responseDocument.querySelectorAll('[class="authors-list"]') ? responseDocument.querySelectorAll('[class="authors-list"]')[0].textContent : '';

          result.affiliation = responseDocument.querySelectorAll('[class="affiliations"] ul')[0].textContent;

          result.journal = responseDocument.querySelectorAll('#full-view-journal-trigger')[0].textContent;

          const yearTry = responseDocument.querySelectorAll('span[class="cit"]')[0].textContent;

          [result.year] = yearTry.split(' ');

          const monthTry = responseDocument.querySelectorAll('span[class="cit"]')[0].textContent;

          [, result.month] = monthTry.split(' ');

          result.abstract = responseDocument.querySelectorAll('#enc-abstract')[0].textContent;

        } catch (error) {

          this.$store.dispatch('errors/setError', error);

        }

        break;

      default:
        throw new Error('Unknown condition passed to scraper.');

    }

  }).catch(function (error) {

    this.$store.dispatch('errors/setError', error);

  });

}

function download(filename, text) {

  const element = document.createElement('a');

  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);

  element.setAttribute('download', filename);

  element.style.display = 'none';

  document.body.append(element);

  element.click();

  element.remove();

}

function generateJSON(result) {

  const jsonTitle = result.title;
  const jsonAffiliation = result.affiliation;
  const jsonAuthors = result.authors;
  const jsonYear = result.year;
  const jsonMonth = result.month;
  const jsonAbstract = result.abstract;
  const jsonJournal = result.journal;
  const object = {
    title: jsonTitle.replace('"', "'"),
    authors: jsonAuthors.replace('"', "'"),
    affiliation: jsonAffiliation.replace('"', "'"),
    journal: jsonJournal.replace('"', "'"),
    publication_year: jsonYear.replace('"', "'"),
    publication_month: jsonMonth.replace('"', "'"),
    abstract: jsonAbstract.replace('"', "'"),
  };
  const jsonOutput = JSON.stringify(object, null, 2); // TypeError: Converting circular structure to JSON

  // Start file download.
  download(`article_${Date.now()}.json`, jsonOutput);

}

const scraper = (url) => {

  switch (new URL(url).hostname) {

    case 'pubmed.ncbi.nlm.nih.gov':
      return api(url);

    case 'www.ncbi.nlm.nih.gov':
      return api(url);

    case 'pubs.rsna.org':
      return Promise.reject(new Error('pubs.rsna.org not implemented'));

    //
    // loadDOIMetadata(
    // a.pathname.split("/")[a.pathname.split("/").length - 2] +
    // "/" +
    // a.pathname.split("/")[a.pathname.split("/").length - 1],
    // callback
    // );
    //
    case 'www.ajronline.org':
      return Promise.reject(new Error('www.ajronline.org not implemented'));

    //
    // loadDOIMetadata(
    // a.pathname.split("/")[a.pathname.split("/").length - 2] +
    // "/" +
    // a.pathname.split("/")[a.pathname.split("/").length - 1]
    // );
    //
    case 'www.jultrasoundmed.org':
      return Promise.reject(new Error('wwww.jultrasoundmed.org not implemented'));

    // loadMetadataFromDocumentWithDOIInMetaTag(
    case 'jnm.snmjournals.org':
      return Promise.reject(new Error('jnm.snmjournals.org not implemented'));

    // loadMetadataFromDocumentWithDOIInMetaTag();
    case 'www.ajnr.org':
      return Promise.reject(new Error('wwww.ajnr.org not implemented'));

    // loadMetadataFromDocumentWithDOIInMetaTag();
    case 'www.jvir.org':
      return Promise.reject(new Error('www.jvir.org not implemented'));

    case 'www.youtube.com':
      return Promise.reject(new Error('wwww.youtube.com not implemented'));

    case 'journals.aps.org':
      return api(url);

    case 'journals.xxxxx.org':
      return scrape(url);

    default:
      return Promise.reject(new Error('Unknown domain: not implemented'));

  }

};

async function fetchData(url) {

  return scraper(url);

}

export { copyToClipboard, generateJSON, fetchData };

