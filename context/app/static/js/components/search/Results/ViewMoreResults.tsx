import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { trackEvent } from 'js/helpers/trackers';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';

function ViewMoreResults() {
  const { searchHits: hits, loadMore, totalHitsCount } = useSearch();
  const { analyticsCategory } = useSearchStore();

  const resultsShown = `${hits.length} Results Shown | ${totalHitsCount} Total Results`;

  const handleClick = useCallback(() => {
    loadMore();
    trackEvent({
      category: analyticsCategory,
      action: 'View More Results',
      label: resultsShown,
    });
  }, [analyticsCategory, resultsShown, loadMore]);

  return (
    <>
      {hits.length !== totalHitsCount && (
        <Button variant="contained" color="primary" onClick={handleClick} fullWidth>
          See More Search Results
        </Button>
      )}
      <Box mt={2}>
        <Typography variant="caption" color="secondary" textAlign="right" component="p">
          {resultsShown}
        </Typography>
      </Box>
    </>
  );
}

export default ViewMoreResults;
