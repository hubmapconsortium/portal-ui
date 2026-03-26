import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { trackEvent } from 'js/helpers/trackers';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';
import { decimal } from 'js/helpers/number-format';

function ViewMoreResults() {
  const { searchHits: hits, loadMore, totalHitsCount } = useSearch();
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const resultsShown = `${decimal.format(hits.length)} Results Shown | ${decimal.format(totalHitsCount ?? 0)} Total Results`;

  const handleClick = useCallback(() => {
    loadMore();
    trackEvent({
      category: analyticsCategory,
      action: 'View More Results',
      label: resultsShown,
    });
  }, [analyticsCategory, resultsShown, loadMore]);

  if (hits.length === 0) {
    return null;
  }

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
