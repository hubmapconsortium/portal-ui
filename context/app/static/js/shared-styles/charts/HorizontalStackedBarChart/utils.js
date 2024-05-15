import { produce } from 'immer';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';

function formatAssayData(assayDataBuckets, colorKey) {
  const formattedData = assayDataBuckets.reduce((acc, d) => {
    const snakeCaseDataType = d.key.mapped_data_type.replace(/ /g, '_');
    // TODO: Get datasets to display from index, instead of depending on patterns in names.
    // The first step is having a hierarchy for assay types:
    // https://github.com/hubmapconsortium/portal-ui/issues/1688
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

function getAssayTypesCompositeAggsQuery(esAggsKey, aggsKeyToReturn) {
  return {
    size: 0,
    aggs: {
      mapped_data_types: {
        composite: {
          sources: [
            {
              mapped_data_type: {
                terms: {
                  field: 'mapped_data_types.keyword',
                },
              },
            },
            {
              [aggsKeyToReturn]: {
                terms: {
                  field: esAggsKey,
                },
              },
            },
          ],
          size: 10000,
        },
      },
    },
  };
}

function getDocCountScale(maxDocCount) {
  return scaleLinear({
    domain: [0, maxDocCount * 1.05],
    nice: true,
  });
}

function getColorScale(colorsValues, colors) {
  return scaleOrdinal({
    domain: colorsValues,
    range: colors,
  });
}

function getDataTypeScale(dataTypes) {
  return scaleBand({
    domain: dataTypes,
    padding: 0.2,
  });
}
export {
  formatAssayData,
  addSumProperty,
  sortBySumAscending,
  getAssayTypeBarChartData,
  getAssayTypesCompositeAggsQuery,
  getDocCountScale,
  getColorScale,
  getDataTypeScale,
};
