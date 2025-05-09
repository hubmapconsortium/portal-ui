import { format } from 'date-fns/format';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Collection } from 'js/components/collections/types';
import { useDownloadTable } from 'js/helpers/download';
import { useCollectionsSearchState } from './CollectionsSearchContext';

const query = {
  ...getAllCollectionsQuery,
  query: { bool: { must: [{ exists: { field: 'doi_url' } }, { exists: { field: 'registered_doi' } }] } },
  _source: ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id', 'created_timestamp'],
};

export function useCollectionHits() {
  const { searchHits, isLoading } = useSearchHits<Collection>(query);
  const collections = searchHits.map((hit) => hit._source);

  return { collections, isLoading };
}

export function useCollections() {
  const search = useCollectionsSearchState();
  const { collections, isLoading } = useCollectionHits();

  const downloadTable = useDownloadTable({
    fileName: 'collections.tsv',
    columnNames: ['Title', 'Number of Datasets', 'Creation Date'],
    rows: collections.map(({ title, datasets, created_timestamp }) => {
      const datasetCount = datasets.length.toString();
      const creationDate = format(new Date(created_timestamp), 'yyyy-MM-dd').toString();
      return [title, datasetCount, creationDate];
    }),
  });

  const filteredCollections = collections
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.created_timestamp - a.created_timestamp);

  return { collections, filteredCollections, isLoading, downloadTable };
}
