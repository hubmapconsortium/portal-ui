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

  async searchBySubstring(props) {
    const { targetEntity, substring } = props;
    const urlParams = new URLSearchParams();

    urlParams.append('substring', substring);

    return this.fetchAndParse(`/cells/${targetEntity}-by-substring.json?${urlParams}`);
  }

  async getDatasets(props) {
    const { type, cellVariableNames, minExpression, minCellPercentage, modality } = props;
    const urlParams = new URLSearchParams();

    cellVariableNames.forEach((cellVariableName) => {
      urlParams.append('cell_variable_name', cellVariableName);
    });
    urlParams.append('min_expression', minExpression);
    urlParams.append('min_cell_percentage', minCellPercentage);
    if (modality) {
      urlParams.append('modality', modality);
    }

    return this.fetchAndParse(`/cells/datasets-selected-by-${type}.json?${urlParams}`);
  }

  async getCellPercentagesForDatasets(props) {
    const { uuids, geneName, minGeneExpression } = props;
    const urlParams = new URLSearchParams();

    uuids.forEach((uuid) => {
      urlParams.append('uuid', uuid);
    });
    urlParams.append('gene_name', geneName);
    urlParams.append('min_gene_expression', minGeneExpression);

    return this.fetchAndParse(`/cells/cell-percentages-for-datasets.json?${urlParams}`);
  }

  getCellExpressionInDatasetURL({ uuid, cellVariableNames }) {
    const urlParams = new URLSearchParams();

    urlParams.append('uuid', uuid);
    cellVariableNames.forEach((name) => {
      urlParams.append('cell_variable_names', name);
    });
    return `/cells/cell-expression-in-dataset.json?${urlParams}`;
  }

  async getCellExpressionInDataset(props) {
    return this.fetchAndParse(this.getCellExpressionInDatasetURL(props));
  }

  async getAllIndexedUUIDs() {
    return this.fetchAndParse(`/cells/all-indexed-uuids.json`);
  }

  getClusterCellMatchesInDatasetURL({ uuid, cellVariableName, minExpression }) {
    const urlParams = new URLSearchParams();

    urlParams.append('uuid', uuid);
    urlParams.append('cell_variable_name', cellVariableName);
    urlParams.append('min_expression', minExpression);

    return `/cells/cells-in-dataset-clusters.json?${urlParams}`;
  }

  async getClusterCellMatchesInDataset(props) {
    return this.fetchAndParse(this.getClusterCellMatchesInDatasetURL(props));
  }
}

export default CellsService;
