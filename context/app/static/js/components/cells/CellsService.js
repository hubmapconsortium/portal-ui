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
    const { type, names, minExpression, minCellPercentage, modality } = props;
    const urlParams = new URLSearchParams();

    names.forEach((geneName) => {
      urlParams.append('name', geneName);
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

  async getCellExpressionInDataset(props) {
    const { uuid, names } = props;
    const urlParams = new URLSearchParams();

    urlParams.append('uuid', uuid);
    names.forEach((name) => {
      urlParams.append('names', name);
    });

    return this.fetchAndParse(`/cells/cell-expression-in-dataset.json?${urlParams}`);
  }

  async getAllIndexedUUIDs() {
    return this.fetchAndParse(`/cells/all-indexed-uuids.json`);
  }

  async getClusterCellMatchesInDataset(props) {
    const { uuid, name, queryType, minExpression } = props;
    const urlParams = new URLSearchParams();

    urlParams.append('uuid', uuid);
    urlParams.append('name', name);
    urlParams.append('min_expression', minExpression);
    urlParams.append('query_type', queryType);

    return this.fetchAndParse(`/cells/cells-in-dataset-clusters.json?${urlParams}`);
  }
}

export default CellsService;
