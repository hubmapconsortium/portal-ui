/* eslint-disable no-param-reassign */
import produce from 'immer';

function getMatchingTerms(aggsData, searchTerm) {
  return Object.entries(aggsData.aggregations).reduce((acc, [k, v]) => {
    return produce(acc, (draft) => {
      const matches = v.buckets.filter((b) => b.key.startsWith(searchTerm));
      if (matches.length > 0) {
        draft[k] = matches;
      }
    });
  }, {});
}

export { getMatchingTerms };
