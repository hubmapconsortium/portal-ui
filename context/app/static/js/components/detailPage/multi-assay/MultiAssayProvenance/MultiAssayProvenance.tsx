import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';

import EntityTile from 'js/components/entity-tile/EntityTile';
import { useFlaskDataContext } from 'js/components/Contexts';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import useRelatedMultiAssayDatasets, { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';

function MultiTileStack({ datasets, title }: { datasets: MultiAssayEntity[]; title: string }) {
  const {
    entity: { uuid: currentEntityUUID, origin_samples, origin_samples_unique_mapped_organs },
  } = useFlaskDataContext();

  if (datasets.length === 0) {
    return null;
  }
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon component={entityIconMap.Dataset} color="primary" fontSize="inherit" sx={{ fontSize: '1.5rem' }} />
        <Typography variant="h5">{title}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={1}>
        {datasets?.map(
          ({ uuid, entity_type, hubmap_id, assay_display_name, descendant_counts, last_modified_timestamp }) => (
            <EntityTile
              key={uuid}
              uuid={uuid}
              entity_type={entity_type}
              id={hubmap_id}
              invertColors={uuid === currentEntityUUID}
              entityData={{
                mapped_data_types: [assay_display_name],
                origin_samples,
                origin_samples_unique_mapped_organs,
                last_modified_timestamp,
              }}
              descendantCounts={descendant_counts?.entity_type ?? { Dataset: 0 }}
            />
          ),
        )}
        s
      </Stack>
    </>
  );
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
}));

function MultiAssayProvenance() {
  const { datasets } = useRelatedMultiAssayDatasets();
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <StyledPaper>
          <Stack spacing={2}>
            <MultiTileStack datasets={datasets.component} title="Components" />
            <MultiTileStack datasets={datasets.raw} title="Primary" />
          </Stack>
        </StyledPaper>
        {datasets?.processed.length > 0 && (
          <Stack spacing={2} sx={{ width: '100%' }} alignItems="center">
            <KeyboardArrowDownIcon sx={{ fontSize: '2rem' }} />
            <StyledPaper>
              <MultiTileStack datasets={datasets.processed} title="Processed" />
            </StyledPaper>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default MultiAssayProvenance;
