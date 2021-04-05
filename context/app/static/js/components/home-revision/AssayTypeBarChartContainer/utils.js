import produce from 'immer';
/* eslint-disable no-param-reassign */

function formatAssayData(assayData, colorKey) {
  const formattedData = assayData.aggregations.mapped_data_types.buckets.reduce((acc, d) => {
    const snakeCaseDataType = d.key.mapped_data_type.replace(/ /g, '_');
    if (snakeCaseDataType.includes('[')) {
      return acc;
    }
    return produce(acc, (draft) => {
      if (!(snakeCaseDataType in draft)) {
        draft[snakeCaseDataType] = {};
      }
      draft[snakeCaseDataType].mapped_data_type = d.key.mapped_data_type;
      draft[snakeCaseDataType][d.key[colorKey]] = d.doc_count;
    });
  }, {});
  return Object.values(formattedData);
}

function addSumProperty(formattedData) {
  return formattedData.map((d) => {
    return produce(d, (draft) => {
      draft.sum = Object.entries(d).reduce((acc, [k, v]) => {
        if (k !== 'mapped_data_type') {
          return acc + v;
        }
        return acc;
      }, 0);
    });
  });
}

function sortBySumAscending(list) {
  list.sort((a, b) => a.sum - b.sum);
}

function getAssayTypeBarChartData(rawData, colorKey) {
  const formattedData = addSumProperty(formatAssayData(rawData, colorKey));
  sortBySumAscending(formattedData);
  const maxSumDocCount = Math.max(...formattedData.map((d) => d.sum));
  return { formattedData, maxSumDocCount };
}

export { formatAssayData, addSumProperty, sortBySumAscending, getAssayTypeBarChartData };
