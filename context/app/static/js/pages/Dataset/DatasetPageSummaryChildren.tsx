import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { InternalLink } from 'js/shared-styles/Links';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';

interface SummaryDataChildrenProps {
  mapped_data_types: string[];
  mapped_organ: string;
}

export default function SummaryDataChildren({ mapped_data_types, mapped_organ }: SummaryDataChildrenProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const dataTypes = mapped_data_types.join(', ');
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
      <SummaryItem showDivider={false}>
        <InternalLink href={`/organs/${mapped_organ}`} underline="none">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <OrganIcon organName={mapped_organ} />
            <Typography fontSize="inherit">{mapped_organ}</Typography>
          </Stack>
        </InternalLink>
      </SummaryItem>
    </>
  );
}
