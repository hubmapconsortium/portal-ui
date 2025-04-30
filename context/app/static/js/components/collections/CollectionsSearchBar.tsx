import React from 'react';
import Stack from '@mui/material/Stack';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { useCollections } from 'js/components/collections/hooks';
import { useCollectionsSearchActions, useCollectionsSearchState } from './CollectionsSearchContext';

const text = {
  placeholder: 'Search collections by title',
  tooltip: 'Download table in TSV format',
};

export default function CollectionsSearchBar() {
  const { search } = useCollectionsSearchState();
  const { setSearch } = useCollectionsSearchActions();
  const { downloadTable } = useCollections();

  return (
    <Stack direction="row" justifyContent="space-between">
      <SearchBar
        sx={{ mb: 2, width: '50%' }}
        placeholder={text.placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DownloadButton tooltip={text.tooltip} onClick={downloadTable} />
    </Stack>
  );
}
