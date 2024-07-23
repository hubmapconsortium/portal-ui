/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useFlaskDataContext } from 'js/components/Contexts';
import StatusIcon from '../../StatusIcon';
import useRelatedMultiAssayDatasets, { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';
import { FlexContainer } from './style';

const text = {
  component: {
    label: 'Component Datasets (Raw)',
    tooltip: 'Listed are the component datasets that comprise the multi-assay dataset.',
  },
  raw: {
    label: 'Primary Dataset (Raw)',
    tooltip:
      'Listed is the primary multi-assay dataset, which contains comprehensive information about the multi-assay.',
  },
  processed: {
    label: 'Primary Dataset (Processed)',
    tooltip:
      'Listed is the processed primary multi-assay dataset, which may contain additional multi-assay information including visualizations.',
  },
  current: {
    tooltip: 'Current Dataset | ',
  },
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

interface MultiAssayLinkProps {
  dataset: MultiAssayEntity;
}
function MultiAssayLink({ dataset: { assay_display_name, uuid, hubmap_id, status } }: MultiAssayLinkProps) {
  return (
    <SecondaryBackgroundTooltip title={status}>
      <Typography>
        <FlexContainer>
          {assay_display_name}:<InternalLink href={`/browse/dataset/${uuid}`}>{hubmap_id}</InternalLink>
          <StatusIcon status={status} />
        </FlexContainer>
      </Typography>
    </SecondaryBackgroundTooltip>
  );
}

function CurrentMultiAssayLink({ dataset }: MultiAssayLinkProps) {
  return (
    <SecondaryBackgroundTooltip title={`${text.current.tooltip} ${dataset.status}`}>
      <Box sx={(theme) => ({ borderLeft: `2px solid ${theme.palette.success.main}`, pl: 0.5 })}>
        <MultiAssayLink dataset={dataset} />
      </Box>
    </SecondaryBackgroundTooltip>
  );
}

function RelatedMultiAssayLinks() {
  const {
    entity: { uuid },
  } = useFlaskDataContext();
  const { datasets } = useRelatedMultiAssayDatasets();

  const entries = Object.entries(datasets) as Entries<typeof datasets>;

  return entries.map(([key, v]) => {
    if (v.length === 0) {
      return null;
    }
    return (
      <LabelledSectionText label={text?.[key]?.label} key={key} iconTooltipText={text?.[key]?.tooltip}>
        <Stack>
          {v.map((dataset) =>
            dataset.uuid === uuid ? (
              <CurrentMultiAssayLink dataset={dataset} key={dataset.uuid} />
            ) : (
              <MultiAssayLink dataset={dataset} key={dataset.uuid} />
            ),
          )}
        </Stack>
      </LabelledSectionText>
    );
  });
}

export default RelatedMultiAssayLinks;
