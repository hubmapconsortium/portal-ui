import React from 'react';
import Stack from '@mui/material/Stack';

import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';
import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import { DefaultSearchViewSwitch } from '../SearchViewSwitch';
import MetadataMenu from '../MetadataMenu';
import { useSearchStore } from '../store';
import { isDevSearch } from '../utils';

function TableHeaderActions() {
  const type = useSearchStore((state) => state.type);
  const devSearch = isDevSearch(type);

  return (
    <Stack direction="row" spacing={1} flexWrap="nowrap" alignItems="center">
      <MetadataMenu type={type} />
      {!devSearch && (
        <>
          <WorkspacesDropdownMenu type={type} />
          <SaveEntitiesButtonFromSearch entity_type={type} />
          <BulkDownloadButtonFromSearch type={type} />
        </>
      )}
      <DefaultSearchViewSwitch />
    </Stack>
  );
}

export default TableHeaderActions;
