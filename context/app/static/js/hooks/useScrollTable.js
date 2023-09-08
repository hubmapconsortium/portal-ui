import { useSortState } from 'js/hooks/useSortState';
import { useScrollSearchHits, useAllSearchIDs } from 'js/hooks/useSearchData';
import { keepPreviousData } from 'js/helpers/swr';

function useScrollTable({ query, columnNameMapping, initialSortState }) {
  const { sortState, setSort, sort } = useSortState(columnNameMapping, initialSortState);

  const queryWithSort = { ...query, sort };

  const { allSearchIDs } = useAllSearchIDs(query, {});

  const { searchHits, isLoading, loadMore, totalHitsCount } = useScrollSearchHits(queryWithSort, {
    pageSize: queryWithSort.size ?? 100,
    use: [keepPreviousData],
  });

  return { searchHits, allSearchIDs, isLoading, loadMore, totalHitsCount, sortState, setSort };
}

export default useScrollTable;
