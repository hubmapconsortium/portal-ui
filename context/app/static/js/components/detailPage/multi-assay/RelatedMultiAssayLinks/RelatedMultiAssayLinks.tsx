import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useFlaskDataContext } from 'js/components/Contexts';
import { datasetSectionId } from 'js/pages/Dataset/utils';
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
    linkTooltip: (status: string) => `Scroll down to the processed dataset. Status: ${status}`,
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
  href?: string | null;
}

function MultiAssayLink({
  dataset: { assay_display_name, hubmap_id, status },
  tooltipText,
  href,
}: MultiAssayLinkProps) {
  const link = href ? <InternalLink href={href}>{hubmap_id}</InternalLink> : hubmap_id;
  return (
    <Typography>
      <Stack direction="row" useFlexGap gap={0.5} alignItems="center">
        <SecondaryBackgroundTooltip title={tooltipText} disabled={!tooltipText}>
          <Box display="inline-block" component="span">
            {assay_display_name}: {link}
          </Box>
        </SecondaryBackgroundTooltip>
        <SecondaryBackgroundTooltip title={`Status: ${status}`}>
          <Box display="inline-block" component="span">
            <StatusIcon status={status} />
          </Box>
        </SecondaryBackgroundTooltip>
      </Stack>
    </Typography>
  );
}

function CurrentMultiAssayLink({ dataset }: Pick<MultiAssayLinkProps, 'dataset'>) {
  return (
    <Box sx={(theme) => ({ borderLeft: `2px solid ${theme.palette.success.main}`, pl: 0.5 })}>
      <MultiAssayLink dataset={dataset} tooltipText={`${text.current.tooltip} ${dataset.status}`} />
    </Box>
  );
}

function createLinkHref(dataset: MultiAssayEntity) {
  if (dataset.is_component) {
    return null;
  }
  if (dataset.processing === 'raw') {
    return `/browse/dataset/${dataset.uuid}`;
  }

  return `#${datasetSectionId(dataset, 'section')}`;
}

function createTooltipText(dataset: MultiAssayEntity) {
  if (dataset.processing !== 'raw') {
    return text.processed.linkTooltip(dataset.status);
  }
  return undefined;
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
              <MultiAssayLink
                dataset={dataset}
                key={dataset.uuid}
                href={createLinkHref(dataset)}
                tooltipText={createTooltipText(dataset)}
              />
            ),
          )}
        </Stack>
      </LabelledSectionText>
    );
  });
}

export default RelatedMultiAssayLinks;
