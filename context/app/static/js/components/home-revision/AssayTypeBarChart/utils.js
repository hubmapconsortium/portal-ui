import produce from 'immer';
/* eslint-disable no-param-reassign */

function formatAssayData(assayData) {
  const formattedData = assayData.aggregations.mapped_data_types.buckets.reduce((acc, o) => {
    return produce(acc, (draft) => {
      const k = o.key.mapped_data_type.replace(/ /g, '_');
      if (!(k in draft)) {
        draft[k] = {};
      }
      draft[k].mapped_data_type = o.key.mapped_data_type;
      draft[k][o.key.organ_type] = o.doc_count;
    });
  }, {});
  return Object.values(formattedData);
}

function getMaxDataValue(formattedData) {
  return formattedData.map((o) => {
    return Object.entries(o).reduce((acc, [k, v]) => {
      if (k !== 'mapped_data_type') {
        return acc + v;
      }
      return acc;
    }, 0);
  });
}

export { formatAssayData, getMaxDataValue };
