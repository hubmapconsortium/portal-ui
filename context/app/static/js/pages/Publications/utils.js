function countPublicationAggs(aggsBuckets) {
  return aggsBuckets.reduce(
    (acc, { key_as_string, doc_count }) => {
      if (!['false', 'true'].includes(key_as_string)) {
        return acc;
      }

      /* eslint-disable operator-assignment */
      acc.statuses[key_as_string].count = acc.statuses[key_as_string].count + doc_count;
      acc.publicationsCount = acc.publicationsCount + doc_count;
      /* eslint-enable operator-assignment */

      return acc;
    },
    {
      statuses: {
        true: { category: 'Peer Reviewed', id: 'peer-reviewed', count: 0 },
        false: { category: 'Preprint', id: 'preprint', count: 0 },
      },
      publicationsCount: 0,
    },
  );
}

export { countPublicationAggs };
