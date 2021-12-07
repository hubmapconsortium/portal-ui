import React from 'react';
import { Pagination } from 'searchkit';

import ResultsFound from '../ResultsFound';
import { Flex } from './style';

function PaginationWrapper() {
  return (
    <Flex>
      <Pagination showNumbers />
      <ResultsFound />
    </Flex>
  );
}

export default PaginationWrapper;
