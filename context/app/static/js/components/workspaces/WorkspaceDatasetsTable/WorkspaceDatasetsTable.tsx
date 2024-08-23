import React, { useMemo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { DatasetDocument } from 'js/typings/search';
import { getIDsQuery } from 'js/helpers/queries';
import { hubmapID, lastModifiedTimestamp, assayTypes, status, organ } from 'js/shared-styles/tables/columns';
import { Copy, Delete } from 'js/shared-styles/tables/actions';
import { AddIcon } from 'js/shared-styles/icons';

import { isWorkspaceAtDatasetLimit } from 'js/helpers/functions';
import WorkspacesUpdateButton from '../WorkspacesUpdateButton';
import { MergedWorkspace } from '../types';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from '../api';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
const tooltips = {
  add: 'Add datasets to this workspace.',
  delete: 'Remove selected datasets.',
  maxDatasets: `Workspaces are limited to ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. No more datasets can be added to this workspace.`,
};

interface WorkspaceDatasetsTableProps {
  datasetsUUIDs: string[];
  removeDatasets?: (ids: string[]) => void;
  addDatasets?: MergedWorkspace;
  label?: ReactNode;
  disabledIDs?: Set<string>;
  emptyAlert?: ReactNode;
  additionalButtons?: ReactNode;
  hideTableIfEmpty?: boolean;
}

function WorkspaceDatasetsTable({
  datasetsUUIDs,
  removeDatasets,
  addDatasets,
  label,
  disabledIDs,
  emptyAlert,
  additionalButtons,
  hideTableIfEmpty,
}: WorkspaceDatasetsTableProps) {
  const { selectedRows } = useSelectableTableStore();
  const query = useMemo(
    () => ({
      query: {
        ...getIDsQuery(datasetsUUIDs),
      },
      size: 500,
      _source: [
        'hubmap_id',
        'origin_samples_unique_mapped_organs',
        'mapped_status',
        'mapped_data_types',
        'mapped_data_access_level',
        'uuid',
        'last_modified_timestamp',
      ],
    }),
    [datasetsUUIDs],
  );

  const datasetsPresent = datasetsUUIDs.length > 0;
  const hasMaxDatasets = addDatasets && isWorkspaceAtDatasetLimit(addDatasets);
  const hideTable = hideTableIfEmpty && !datasetsPresent;

  return (
    <Box>
      <SpacedSectionButtonRow
        leftText={label}
        buttons={
          <Stack direction="row" gap={1}>
            {datasetsPresent && <Copy />}
            {addDatasets && (
              <WorkspacesUpdateButton
                workspace={addDatasets}
                dialogType="ADD_DATASETS"
                tooltip={hasMaxDatasets ? tooltips.maxDatasets : tooltips.add}
                disabled={hasMaxDatasets}
              >
                <AddIcon />
              </WorkspacesUpdateButton>
            )}
            {removeDatasets && datasetsPresent && (
              <Delete
                onClick={() => removeDatasets([...selectedRows])}
                tooltip={tooltips.delete}
                disabled={selectedRows.size === 0}
              />
            )}
            {additionalButtons}
          </Stack>
        }
      />
      {hideTable ? (
        emptyAlert
      ) : (
        <EntitiesTables<DatasetDocument>
          entities={[{ query, columns, entityType: 'Dataset' }]}
          disabledIDs={disabledIDs}
          emptyAlert={emptyAlert}
        />
      )}
    </Box>
  );
}
export default withSelectableTableProvider(WorkspaceDatasetsTable, 'workspace-datasets');
