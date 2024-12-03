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
import { useEntityTileAriaLabelText } from 'js/hooks/useEntityTileAriaLabel';
import useRelatedMultiAssayDatasets, { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';

function MultiTileStack({ datasets, title }: { datasets: MultiAssayEntity[]; title: string }) {
  const {
    entity: { uuid: currentEntityUUID, origin_samples, origin_samples_unique_mapped_organs },
  } = useFlaskDataContext();

  const ariaLabelTexts = useEntityTileAriaLabelText(
    datasets.map((dataset) => ({
      entity_type: dataset.entity_type,
      hubmap_id: dataset.hubmap_id,
      origin_samples_unique_mapped_organs: dataset.origin_samples_unique_mapped_organs,
      assay_display_name: dataset.assay_display_name,
    })),
  );

  if (datasets.length === 0) {
    return null;
  }

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon component={entityIconMap.Dataset} color="primary" fontSize="inherit" sx={{ fontSize: '1.5rem' }} />
        <Typography variant="h5">{title}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap">
        {datasets.map((dataset, index) => (
          <EntityTile
            key={dataset.uuid}
            uuid={dataset.uuid}
            entity_type={dataset.entity_type}
            ariaLabelText={ariaLabelTexts[index]}
            id={dataset.hubmap_id}
            invertColors={dataset.uuid === currentEntityUUID}
            entityData={{
              mapped_data_types: [dataset.assay_display_name[0]],
              origin_samples,
              origin_samples_unique_mapped_organs,
              published_timestamp: dataset.published_timestamp,
              created_timestamp: dataset.created_timestamp,
              entity_type: dataset.entity_type,
              descendant_counts: dataset.descendant_counts,
            }}
            descendantCounts={dataset.descendant_counts?.entity_type ?? { Dataset: 0 }}
          />
        ))}
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
