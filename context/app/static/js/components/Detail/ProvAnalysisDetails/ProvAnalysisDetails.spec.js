/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import ProvAnalysisDetails from './ProvAnalysisDetails';

test('should display ingest and cwl lists', () => {
  const dagListData = [
    { origin: 'https://github.com/fake1/fake1.git', hash: 'aaaaaaa' },
    { origin: 'https://github.com/fake2/fake2.git', hash: 'bbbbbbb' },
    { origin: 'https://github.com/fake3/fake3.git', hash: 'ccccccc', name: 'fake3.cwl' },
  ];
  render(<ProvAnalysisDetails dagListData={dagListData} />);

  const pipelineLists = screen.getAllByRole('list');
  const ingestList = pipelineLists[0];
  const cwlList = pipelineLists[1];

  expect(ingestList).toContainElement(screen.getByText('Ingest Pipelines'));
  expect(ingestList.children).toHaveLength(3);
  expect(cwlList).toContainElement(screen.getByText('CWL Pipelines'));
  expect(cwlList.children).toHaveLength(2);
});
