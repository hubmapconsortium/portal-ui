import produce from 'immer';
/* eslint-disable no-param-reassign */

function formatAssayData(assayData) {
  const formattedData = assayData.aggregations.mapped_data_types.buckets.reduce((acc, d) => {
    return produce(acc, (draft) => {
      const snakeCaseDataType = d.key.mapped_data_type.replace(/ /g, '_');
      if (!(snakeCaseDataType in draft)) {
        draft[snakeCaseDataType] = {};
      }
      draft[snakeCaseDataType].mapped_data_type = d.key.mapped_data_type;
      draft[snakeCaseDataType][d.key.organ_type] = d.doc_count;
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

export { formatAssayData, addSumProperty, sortBySumAscending };
