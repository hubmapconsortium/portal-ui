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
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import Typography from '@mui/material/Typography';
import WorkspacesUpdateButton from '../WorkspacesUpdateButton';
import { MergedWorkspace } from '../types';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
const tooltips = {
  add: 'Add datasets to this workspace.',
  delete: 'Remove selected datasets.',
};

const noDatasetsText =
  'There are no datasets in this workspace. Navigate to the dataset search page to find and add datasets to your workspace.';

interface WorkspaceDatasetsTableProps {
  datasetsUUIDs: string[];
  removeDatasets?: (ids: string[]) => void;
  addDatasets?: MergedWorkspace;
  label?: ReactNode;
  disabledIDs?: Set<string>;
  additionalButtons?: ReactNode;
}

function WorkspaceDatasetsTable({
  datasetsUUIDs,
  removeDatasets,
  addDatasets,
  label,
  disabledIDs,
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

  const datasetsSection = datasetsPresent ? (
    <EntitiesTables<DatasetDocument> entities={[{ query, columns, entityType: 'Dataset' }]} disabledIDs={disabledIDs} />
  ) : (
    <Alert
      severity="info"
      action={
        <Button>
          <InternalLink href="/search?entity_type[0]=Dataset">
            <Typography color="primary" variant="button">
              Dataset Search Page
            </Typography>
          </InternalLink>
        </Button>
      }
    >
      {noDatasetsText}
    </Alert>
  );

  return (
    <Box>
      <SpacedSectionButtonRow
        leftText={label}
        buttons={
          <Stack direction="row" gap={1}>
            {datasetsPresent && <Copy />}
            {addDatasets && (
              <WorkspacesUpdateButton workspace={addDatasets} dialogType="ADD_DATASETS" tooltip={tooltips.add}>
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
      {datasetsSection}
    </Box>
  );
}
export default withSelectableTableProvider(WorkspaceDatasetsTable, 'workspace-datasets');
