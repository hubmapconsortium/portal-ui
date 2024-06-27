import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useSearch } from '../Search';

function ViewMoreResults() {
  const { searchHits: hits, loadMore, totalHitsCount } = useSearch();

  return (
    <>
      <Button variant="contained" color="primary" onClick={loadMore} fullWidth>
        See More Search Results
      </Button>
      <Box mt={2}>
        <Typography variant="caption" color="secondary" textAlign="right" component="p">
          {hits.length} Results Shown | {totalHitsCount} Total Results
        </Typography>
      </Box>
    </>
  );
}

export default ViewMoreResults;
