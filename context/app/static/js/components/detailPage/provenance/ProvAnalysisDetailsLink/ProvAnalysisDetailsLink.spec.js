import React from 'react';
import { render, screen } from 'test-utils/functions';

import ProvAnalysisDetailsLink from './ProvAnalysisDetailsLink';

test('should display ingest pipeline link', () => {
  const fakePipeline = { origin: 'https://github.com/fake/fake.git', hash: 'aabbccd' };
  render(<ProvAnalysisDetailsLink data={fakePipeline} />);
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/fake/fake/tree/aabbccd');
});

test('should display correct cwl pipeline links when origin ends with .git', () => {
  const fakePipeline = { origin: 'https://github.com/fake/fake.git', hash: 'aabbccd', name: 'fake.cwl' };

  const fakeGithubDomainAndPath = 'github.com/fake/fake/blob/aabbccd/fake.cwl';
  const fakeProtocol = 'https://';
  const fakeUrl = fakeProtocol.concat(fakeGithubDomainAndPath);

  const cwlUrl = `https://view.commonwl.org/workflows/${fakeGithubDomainAndPath}`;

  render(<ProvAnalysisDetailsLink data={fakePipeline} />);
  expect(screen.getByRole('link', { name: fakeUrl })).toHaveAttribute('href', fakeUrl);
  expect(screen.getByRole('link', { name: 'Open in CWL Viewer' })).toHaveAttribute('href', cwlUrl);
});

test.each([['https://github.com/fake/fake'], ['https://github.com/fake/fake.git']])(
  'should handle origin fields ending with and without .git and display correct cwl pipeline link for %s',
  (origin) => {
    const fakePipeline = { origin, hash: 'aabbccd', name: 'fake.cwl' };

    const fakeGithubDomainAndPath = 'github.com/fake/fake/blob/aabbccd/fake.cwl';
    const fakeProtocol = 'https://';
    const fakeUrl = fakeProtocol.concat(fakeGithubDomainAndPath);

    const cwlUrl = `https://view.commonwl.org/workflows/${fakeGithubDomainAndPath}`;

    render(<ProvAnalysisDetailsLink data={fakePipeline} />);
    expect(screen.getByRole('link', { name: fakeUrl })).toHaveAttribute('href', fakeUrl);
    expect(screen.getByRole('link', { name: 'Open in CWL Viewer' })).toHaveAttribute('href', cwlUrl);
  },
);
