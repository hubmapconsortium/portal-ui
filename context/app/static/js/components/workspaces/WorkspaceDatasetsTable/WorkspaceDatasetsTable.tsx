import React, { useMemo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { DatasetDocument } from 'js/typings/search';
import { getIDsQuery } from 'js/helpers/queries';
import {
  lastModifiedTimestamp,
  assayTypes,
  status,
  organ,
  hubmapID,
  hubmapIDWithLinksInNewTab,
} from 'js/shared-styles/tables/columns';
import { Copy, Delete } from 'js/shared-styles/tables/actions';
import { AddIcon } from 'js/shared-styles/icons';

import { isWorkspaceAtDatasetLimit } from 'js/helpers/functions';
import WorkspacesUpdateButton from '../WorkspacesUpdateButton';
import { MergedWorkspace, WorkspacesEventInfo } from '../types';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from '../api';

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
  emptyAlert?: ReactNode;
  additionalButtons?: ReactNode;
  hideTableIfEmpty?: boolean;
  isSelectable?: boolean;
  trackingInfo?: WorkspacesEventInfo;
  openLinksInNewTab?: boolean;
}

function WorkspaceDatasetsTable({
  datasetsUUIDs,
  removeDatasets,
  addDatasets,
  copyDatasets,
  label,
  disabledIDs,
  emptyAlert,
  additionalButtons,
  hideTableIfEmpty,
  isSelectable = true,
  trackingInfo,
  openLinksInNewTab,
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

  const columns = useMemo(
    () => [openLinksInNewTab ? hubmapIDWithLinksInNewTab : hubmapID, organ, assayTypes, status, lastModifiedTimestamp],
    [openLinksInNewTab],
  );

  const datasetsPresent = datasetsUUIDs.length > 0;
  const hasMaxDatasets = addDatasets && isWorkspaceAtDatasetLimit(addDatasets);
  const hideTable = hideTableIfEmpty && !datasetsPresent;
  const hideButtonRow = (!addDatasets && !removeDatasets && !copyDatasets && !additionalButtons) || !datasetsPresent;

  return (
    <Box>
      {!hideButtonRow && (
        <SpacedSectionButtonRow
          leftText={label}
          buttons={
            <Stack direction="row" gap={1}>
              {copyDatasets && datasetsPresent && <Copy trackingInfo={trackingInfo} />}
              {addDatasets && (
                <WorkspacesUpdateButton
                  workspace={addDatasets}
                  dialogType="ADD_DATASETS"
                  tooltip={hasMaxDatasets ? tooltips.maxDatasets : tooltips.add}
                  disabled={hasMaxDatasets}
                  trackingInfo={trackingInfo && { ...trackingInfo, action: 'Launch Add Datasets Dialog' }}
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
      {hideTable ? (
        emptyAlert
      ) : (
        <EntitiesTables<DatasetDocument>
          entities={[{ query, columns, entityType: 'Dataset' }]}
          disabledIDs={disabledIDs}
          emptyAlert={emptyAlert}
          isSelectable={isSelectable}
          numSelected={selectedRows.size}
          trackingInfo={trackingInfo}
        />
      )}
    </Box>
  );
}
export default withSelectableTableProvider(WorkspaceDatasetsTable, 'workspace-datasets');
