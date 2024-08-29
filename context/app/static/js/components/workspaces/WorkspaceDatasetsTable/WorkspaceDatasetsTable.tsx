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
  copyDatasets?: boolean;
  label?: ReactNode;
  disabledIDs?: Set<string>;
  additionalAlerts?: ReactNode;
  additionalButtons?: ReactNode;
}

function WorkspaceDatasetsTable({
  datasetsUUIDs,
  removeDatasets,
  addDatasets,
  copyDatasets,
  label,
  disabledIDs,
  additionalAlerts,
  additionalButtons,
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
  const buttonOptionsPresent = copyDatasets ?? addDatasets ?? removeDatasets ?? additionalButtons;

  return (
    <Box>
      {buttonOptionsPresent && (
        <SpacedSectionButtonRow
          leftText={label}
          buttons={
            <Stack direction="row" gap={1}>
              {copyDatasets && datasetsPresent && <Copy />}
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
      )}
      {datasetsPresent ? (
        <EntitiesTables<DatasetDocument>
          entities={[{ query, columns, entityType: 'Dataset' }]}
          disabledIDs={disabledIDs}
        />
      ) : (
        additionalAlerts
      )}
    </Box>
  );
}
export default withSelectableTableProvider(WorkspaceDatasetsTable, 'workspace-datasets');
