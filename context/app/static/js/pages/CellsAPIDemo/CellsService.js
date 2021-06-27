/* eslint-disable class-methods-use-this */
// Right now, the object doesn't have any state, but down the road,
// it might cache results, or the API calls might be made from the JS instead of Python,
// and then the instance would be initialized with the Cells API URL.

class CellsService {
  async fetchAndParse(url) {
    const response = await fetch(url, { method: 'POST' });
    const responseJson = await response.json();
    if ('message' in responseJson) {
      throw Error(responseJson.message);
    }
    if ('results' in responseJson) {
      return responseJson.results;
    }
    throw Error('Expected "message" or "results"');
  }

  async getCellExpressionInDataset(props) {
    const { uuid, geneNames } = props;
    const urlParams = new URLSearchParams();
    urlParams.append('uuid', uuid);
    geneNames.forEach((geneName) => {
      urlParams.append('gene_name', geneName);
    });
    return this.fetchAndParse(`/cells/cell-expression-in-dataset.json?${urlParams}`);
  }
}

export default CellsService;
