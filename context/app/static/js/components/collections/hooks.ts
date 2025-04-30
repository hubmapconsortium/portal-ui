import { format } from 'date-fns/format';
import { useEventCallback } from '@mui/material/utils';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Collection } from 'js/components/collections/types';
import { createDownloadUrl } from 'js/helpers/functions';
import { checkAndDownloadFile } from 'js/helpers/download';
import { useSnackbarActions } from 'js/shared-styles/snackbars/store';
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
  const { collections, isLoading } = useCollectionHits();
  const { search } = useCollectionsSearchState();
  const { toastError, toastSuccess } = useSnackbarActions();

  const filteredCollections = collections.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  const downloadTable = useEventCallback(() => {
    const header = 'Title\tDataset Count\tCreation Date';
    const rows = filteredCollections.map(({ title, datasets, created_timestamp }) => {
      const datasetCount = datasets.length;
      const creationDate = format(new Date(created_timestamp), 'yyyy-MM-dd');
      return `${title}\t${datasetCount}\t${creationDate}`;
    });

    const tsvContent = [header, ...rows].join('\n');
    const url = createDownloadUrl(tsvContent, 'text/tab-separated-values');

    checkAndDownloadFile({ url, fileName: 'collections.tsv' })
      .then(() => {
        toastSuccess('Collections downloaded successfully.');
      })
      .catch((e) => {
        toastError('Error downloading collections. Please try again.');
        console.error(e);
      });
  });

  return { collections, filteredCollections, isLoading, downloadTable };
}
