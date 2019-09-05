import { API_SERVER } from '../../../../config';

async function getAPICategoryNames() {
  return $.ajax({
    type: 'GET',
    url: `${API_SERVER}api/v1/categories`,
    dataType: 'json',
    success(data) {
      return data;
    },
    failure(error) {
      throw new Error(`Getting categories failed! The server said: ${error}`);
    }
  });
}

let promise;

async function getCategoryNames() {
  if (!promise) {
    promise = getAPICategoryNames();
  }
  return promise;
}

export default getCategoryNames;
