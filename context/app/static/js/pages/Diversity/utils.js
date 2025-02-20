function getAgeLabels(buckets, key) {
  return [...new Set(buckets.map((b) => (b.key[key] === 0 ? '<10' : `${b.key[key]}-${b.key[key] + 9}`)))];
}

function getBloodTypeLabels(buckets, key) {
  return [...new Set(buckets.map((b) => b.key[key].replace('Blood Type', '')))];
}

function getKeyValues(buckets, key) {
  return [...new Set(buckets.map((b) => b.key[key]))];
}

function makeTermSource(field) {
  const esField = `mapped_metadata.${field}`;
  const source = {};
  source[esField] = {
    terms: {
      field: `mapped_metadata.${field}.keyword`,
    },
  };
  return source;
}

function makeHistogramSource(field) {
  const esField = `mapped_metadata.${field}`;
  const source = {};
  source[esField] = {
    histogram: {
      field: `${esField}_value`,
      interval: 10,
    },
  };
  return source;
}

function makeCompositeQuery(source1, source2) {
  return {
    size: 0,
    aggs: {
      composite_data: {
        composite: {
          sources: [source1, source2],
          size: 10000,
        },
      },
    },
  };
}

export { getAgeLabels, getBloodTypeLabels, getKeyValues, makeHistogramSource, makeTermSource, makeCompositeQuery };
