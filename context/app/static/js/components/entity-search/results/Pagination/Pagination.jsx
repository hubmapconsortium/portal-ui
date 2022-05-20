import React from 'react';
import MuiPagination from '@material-ui/lab/Pagination';

import { useSearchkit } from '@searchkit/client';

function Pagination({ data }) {
  const api = useSearchkit();

  return (
    <MuiPagination
      count={data?.hits.page.totalPages}
      page={data?.hits.page.pageNumber + 1}
      defaultPage={1}
      color="primary"
      onChange={(e, v) => {
        api.setPage({ size: data.hits.page.size, from: (v - 1) * data.hits.page.size });
        api.search();
      }}
      variant="outlined"
      shape="rounded"
    />
  );
}

export default Pagination;
