/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Stack from '@mui/material/Stack';
import SectionItem from 'js/components/detailPage/SectionItem';
import { Typography } from '@mui/material';
import { InternalLink } from 'js/shared-styles/Links';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import useRelatedMultiAssayDatasets from '../useRelatedMultiAssayDatasets';

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
    tooltip: 'This is the current dataset that you are viewing.',
  },
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

function RelatedMultiAssayLinks() {
  const { datasets } = useRelatedMultiAssayDatasets();

  const entries = Object.entries(datasets) as Entries<typeof datasets>;

  return entries.map(([key, v]) => {
    if (v.length === 0) {
      return null;
    }
    return (
      <LabelledSectionText label={text?.[key]?.label} key={key} iconTooltipText={text?.[key]?.tooltip}>
        <Stack>
          {v.map((dataset) => (
            <Typography key={dataset.uuid}>
              {dataset.assay_display_name}:{' '}
              <InternalLink href={`/browse/dataset/${dataset.uuid}`}>{dataset.hubmap_id}</InternalLink>
            </Typography>
          ))}
        </Stack>
      </LabelledSectionText>
    );
  });
}

export default RelatedMultiAssayLinks;
