/* eslint-disable class-methods-use-this */
class CellsService {
  async getCellExpressionInDataset(props) {
    const { uuid, geneNames } = props;
    const urlParams = new URLSearchParams();
    urlParams.append('uuid', uuid);
    geneNames.forEach((geneName) => {
      urlParams.append('gene_name', geneName);
    });

    const firstResponse = await fetch(`/cells/cell-expression-in-dataset.json?${urlParams}`, {
      method: 'POST',
    });
    const responseJson = await firstResponse.json();
    if ('message' in responseJson) {
      throw Error(responseJson.message);
    }
    if ('results' in responseJson) {
      return responseJson.results;
    }
    throw Error('Expected "message" or "results"');
  }
}

export default CellsService;
