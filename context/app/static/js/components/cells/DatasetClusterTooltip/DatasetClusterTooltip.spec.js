import React from 'react';
import { render, screen } from 'test-utils/functions';

import DatasetClusterTooltip from './DatasetClusterTooltip';

test('should display correct text', () => {
  render(
    <DatasetClusterTooltip
      tooltipData={{ key: 'matched', bar: { data: { matched: 20, unmatched: 30, cluster_number: 2 } } }}
    />,
  );

  expect(screen.getByText('Cluster 2')).toBeInTheDocument();
  expect(screen.getByText('20 (40.00%) cells matched.')).toBeInTheDocument();
});
