import { produce } from 'immer';
import { scaleLinear, scaleOrdinal, scaleBand, StringLike } from '@visx/scale';

interface AssayDataBucket {
  key: {
    mapped_data_type: string;
    [key: string]: string | number;
  };
  doc_count: number;
}

type Summable = Record<string, number>;

function formatAssayData(assayDataBuckets: AssayDataBucket[], colorKey: string): Summable[] {
  const formattedData = assayDataBuckets.reduce((acc, d) => {
    const snakeCaseDataType = d.key.mapped_data_type.replace(/ /g, '_');
    // TODO: Get datasets to display from index, instead of depending on patterns in names.
    // The first step is having a hierarchy for assay types:
    // https://github.com/hubmapconsortium/portal-ui/issues/1688
    return produce<Record<string, object>>(acc, (draft) => {
      if (!(snakeCaseDataType in draft)) {
        draft[snakeCaseDataType] = {};
      }
      /* @ts-expect-error this will need to be cleaned up anyway */
      draft[snakeCaseDataType].mapped_data_type = d.key.mapped_data_type;
      /* @ts-expect-error this will need to be cleaned up anyway */
      draft[snakeCaseDataType][d.key[colorKey]] = d.doc_count;
    });
  }, {});
  return Object.values(formattedData);
}

function addSumProperty(formattedData: Summable[]) {
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

function sortBySumAscending(list: Summable[]) {
  list.sort((a, b) => a.sum - b.sum);
}

function getAssayTypeBarChartData(rawData: AssayDataBucket[], colorKey: string) {
  const formattedData = addSumProperty(formatAssayData(rawData, colorKey));
  sortBySumAscending(formattedData);
  const maxSumDocCount = Math.max(...formattedData.map((d) => d.sum));
  return { formattedData, maxSumDocCount };
}

function getOrganTypesCompositeAggsQuery(esAggsKey: string, aggsKeyToReturn: string) {
  return {
    size: 0,
    aggs: {
      organs: {
        composite: {
          sources: [
            {
              organ: {
                terms: {
                  field: 'origin_samples.mapped_organ.keyword',
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

function getDocCountScale(maxDocCount: number) {
  return scaleLinear({
    domain: [0, maxDocCount * 1.05],
    nice: true,
  });
}

function getColorScale(colorsValues: string[], colors: string[]) {
  return scaleOrdinal({
    domain: colorsValues,
    range: colors,
  });
}

function getDataTypeScale(dataTypes: StringLike[]) {
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
  getOrganTypesCompositeAggsQuery,
  getDocCountScale,
  getColorScale,
  getDataTypeScale,
};
