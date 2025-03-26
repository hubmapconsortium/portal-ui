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

const text = {
  component: {
    label: 'Component Datasets (Raw)',
    tooltip: 'A component dataset is a dataset that comprises the multi-assay dataset.',
  },
  raw: {
    label: 'Primary Dataset (Raw)',
    tooltip:
      'Primary (raw) datasets contain comprehensive information about the multi-assay, as provided by the data providers, and are composed of the component datasets.',
  },
  processed: {
    label: 'Primary Dataset (Processed)',
    tooltip:
      'Processed primary datasets are analyses generated based on primary (raw) datasets by either HuBMAP using uniform processing pipelines or by an external processing approach.',
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
  tooltipText?: string;
}

function MultiAssayLink({
  dataset: { assay_display_name, uuid, hubmap_id, status },
  tooltipText,
}: MultiAssayLinkProps) {
  return (
    <SecondaryBackgroundTooltip title={tooltipText ?? status}>
      <Typography>
        <Stack direction="row" useFlexGap gap={0.5} alignItems="center">
          {assay_display_name}:<InternalLink href={`/browse/dataset/${uuid}`}>{hubmap_id}</InternalLink>
          <StatusIcon status={status} />
        </Stack>
      </Typography>
    </SecondaryBackgroundTooltip>
  );
}

function CurrentMultiAssayLink({ dataset }: Pick<MultiAssayLinkProps, 'dataset'>) {
  return (
    <Box sx={(theme) => ({ borderLeft: `2px solid ${theme.palette.success.main}`, pl: 0.5 })}>
      <MultiAssayLink dataset={dataset} tooltipText={`${text.current.tooltip} ${dataset.status}`} />
    </Box>
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
