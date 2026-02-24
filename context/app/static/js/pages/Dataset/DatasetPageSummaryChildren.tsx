import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import AnnotationSummary from 'js/components/detailPage/AnnotationSummary';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { InternalLink } from 'js/shared-styles/Links';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { Dataset, Sample } from 'js/components/types';

interface SummaryDataChildrenProps {
  mapped_data_types: string[];
  origin_samples: Sample[];
  calculated_metadata?: Dataset['calculated_metadata'];
}

export default function SummaryDataChildren({
  mapped_data_types,
  origin_samples,
  calculated_metadata,
}: SummaryDataChildrenProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const dataTypes = mapped_data_types.join(', ');
  const mapped_organs = new Set(origin_samples.flatMap((s) => s.mapped_organ));
  const hasAnnotations = calculated_metadata?.object_types?.length && calculated_metadata?.annotation_tools?.length;
  return (
    <>
      <SummaryItem>
        <InternalLink
          href="https://docs.hubmapconsortium.org/assays"
          underline="none"
          onClick={() => {
            trackEntityPageEvent({ action: 'Assay Documentation Navigation', label: dataTypes });
          }}
        >
          {dataTypes}
        </InternalLink>
      </SummaryItem>
      {[...mapped_organs].map((mapped_organ, idx) => (
        <SummaryItem showDivider={idx !== mapped_organs.size - 1 || Boolean(hasAnnotations)} key={mapped_organ}>
          <InternalLink href={`/organs/${mapped_organ}`} underline="none">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <OrganIcon organName={mapped_organ} />
              <Typography fontSize="inherit">{mapped_organ}</Typography>
            </Stack>
          </InternalLink>
        </SummaryItem>
      ))}
      {hasAnnotations && (
        <SummaryItem showDivider={false}>
          <AnnotationSummary calculatedMetadata={calculated_metadata} />
        </SummaryItem>
      )}
    </>
  );
}
