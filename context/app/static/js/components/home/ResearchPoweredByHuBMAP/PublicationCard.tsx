import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PushPinRounded from '@mui/icons-material/PushPinRounded';
import { useEventCallback } from '@mui/material/utils';

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
    <Paper
      component="a"
      variant="outlined"
      href={`/browse/publication/${uuid}`}
      onClick={handleClick}
      sx={(theme) => ({
        display: 'block',
        p: 2,
        height: '100%',
        color: 'inherit',
        textDecoration: 'none',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
        // Respect reduced-motion: keep the shadow cue, drop the movement.
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none', boxShadow: theme.shadows[4] },
        },
      })}
    >
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
              {/* Visual affordance only — the whole card is the link, so this is not a nested anchor. */}
              <Typography variant="body2" color="primary" fontWeight={500}>
                View Publication &rarr;
              </Typography>
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
