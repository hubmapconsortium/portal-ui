import React from 'react';
import Stack from '@mui/material/Stack';
import SearchBar from 'js/shared-styles/inputs/SearchBar';
import { usePublications } from 'js/components/publications/hooks';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { usePublicationsSearchActions, usePublicationsSearchState } from './PublicationsSearchContext';

const text = {
  placeholder: 'Search publications by title',
  tooltip: 'Download table in TSV format',
};

export default function PublicationsSearchBar() {
  const search = usePublicationsSearchState();
  const setSearch = usePublicationsSearchActions();
  const { downloadTable } = usePublications();

  return (
    <Stack direction="row" justifyContent="space-between" mb={2} gap={2} useFlexGap>
      <SearchBar
        sx={{ flexGrow: 1 }}
        placeholder={text.placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DownloadButton tooltip={text.tooltip} onClick={downloadTable} />
    </Stack>
  );
}
