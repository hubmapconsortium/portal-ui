import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEventCallback } from '@mui/material/utils';

import { trackEvent } from 'js/helpers/trackers';
import { useFlaskDataContext } from 'js/components/Contexts';
import PublicationCard from './PublicationCard';
import { usePublicationsForHomepage, parsePinnedUUIDs } from './hooks';

function ResearchPoweredByHuBMAP() {
  const flaskData = useFlaskDataContext();
  const pinnedUUIDs = parsePinnedUUIDs(flaskData.pinnedPublicationUUIDs);
  const { publications, isLoading } = usePublicationsForHomepage(pinnedUUIDs);

  const handleViewAll = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: 'Research Powered by HuBMAP / View All Publications Button',
    });
  });

  if (isLoading) return null;

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">
        Trusted by top institutions to advance spatial and single-cell biomedical research.
      </Typography>
      <Typography variant="body1">
        HuBMAP data powers high-impact discoveries in organ atlases, molecular mapping, and multimodal analysis. Shown
        below is a sample of peer-reviewed publications enabled by HuBMAP data. Additional publications can be explored
        on the Publications page.
      </Typography>
      <div>
        <Button variant="contained" href="/publications" onClick={handleViewAll}>
          View All Publications
        </Button>
      </div>
      <Grid container spacing={2}>
        {publications.map((pub) => (
          <Grid key={pub.uuid} size={{ xs: 12, md: 6 }}>
            <PublicationCard publication={pub} isPinned={pinnedUUIDs.includes(pub.uuid)} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default ResearchPoweredByHuBMAP;
