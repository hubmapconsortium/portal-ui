import { useStore } from 'js/components/entity-search/SearchWrapper/store';

function useGroupedFacets(resultsFacets) {
  const { facets } = useStore();

  return resultsFacets.reduce((acc, facet) => {
    const { facetGroup } = facets[facet.identifier];
    if (!(facetGroup in acc)) {
      acc[facetGroup] = [];
    }
    acc[facetGroup] = [...acc[facetGroup], facet];
    return acc;
  }, {});
}

export { useGroupedFacets };
