import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PushPinRounded from '@mui/icons-material/PushPinRounded';
import { useEventCallback } from '@mui/material/utils';

import { InternalLink } from 'js/shared-styles/Links';
import { trackEvent } from 'js/helpers/trackers';
import { buildSecondaryText } from 'js/components/publications/utils';
import { ContributorAPIResponse, normalizeContributor } from 'js/components/detailPage/ContributorsTable/utils';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

interface PublicationCardProps {
  publication: {
    uuid: string;
    title: string;
    contributors: ContributorAPIResponse[];
    publication_venue: string;
    publication_date: string;
  };
  isPinned: boolean;
}

function PublicationCard({ publication, isPinned }: PublicationCardProps) {
  const { uuid, title, contributors = [], publication_venue } = publication;

  const secondaryText = buildSecondaryText(publication_venue, contributors.map(normalizeContributor));

  const handleClick = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: 'Research Powered by HuBMAP / View Publication',
      label: title,
    });
  });

  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Box display="flex" height="100%">
        <Stack spacing={2} flex={1} minWidth={0}>
          <Typography
            variant="h4"
            component="h3"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {secondaryText}
              </Typography>
              <InternalLink href={`/browse/publication/${uuid}`} onClick={handleClick}>
                View Publication &rarr;
              </InternalLink>
            </Stack>
            {isPinned && (
              <Box display="flex" alignItems="flex-end">
                <SecondaryBackgroundTooltip title="Highlighted Publication" placement="top">
                  <PushPinRounded color="success" sx={{ transform: 'rotate(-45deg)' }} />
                </SecondaryBackgroundTooltip>
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default PublicationCard;
