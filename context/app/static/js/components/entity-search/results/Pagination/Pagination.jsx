import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import { useSearchkit } from '@searchkit/client';

import ResultsFound from 'js/components/entity-search/results/ResultsFound/';
import { Flex } from './style';

function Pagination({ pageHits: { totalPages, pageNumber, size, total } }) {
  const api = useSearchkit();

  return (
    <Flex>
      <MuiPagination
        count={totalPages}
        page={pageNumber + 1}
        defaultPage={1}
        color="primary"
        onChange={(e, v) => {
          api.setPage({ size, from: (v - 1) * size });
          api.search();
        }}
        variant="outlined"
        shape="rounded"
      />
      <ResultsFound totalHits={total} />
    </Flex>
  );
}

export default Pagination;
