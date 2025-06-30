import React from 'react';
import { render, screen } from 'test-utils/functions';

import AnalysisDetails from './AnalysisDetails';

test('should display ingest and cwl lists', () => {
  const dagListData = [
    { origin: 'https://github.com/fake1/fake1.git', hash: 'aaaaaaa', name: 'Pipeline A', version: 'v1.0.0' },
    { origin: 'https://github.com/fake2/fake2.git', hash: 'bbbbbbb', documentation_url: 'fake.fake' },
    { origin: 'https://github.com/fake3/fake3.git', hash: 'ccccccc', name: 'fake3.cwl' },
  ];
  render(<AnalysisDetails dagListData={dagListData} />);

  expect(screen.getByText('Pipeline A (v1.0.0)')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'https://github.com/fake1/fake1.git' })).toHaveAttribute(
    'href',
    'https://github.com/fake1/fake1.git',
  );

  expect(screen.getByRole('link', { name: 'fake.fake' })).toHaveAttribute('href', 'fake.fake');

  expect(screen.getByRole('link', { name: 'Open CWL Viewer' })).toHaveAttribute('href');
});
