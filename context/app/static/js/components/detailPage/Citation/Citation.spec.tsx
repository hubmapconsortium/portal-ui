import React from 'react';
// Plain RTL render: a composed story already carries the preview's `Providers` decorator,
// so wrapping it again in the one from test-utils would nest two of them.
import { render, screen } from '@testing-library/react';
import { composeStories } from 'test-utils/storybook';

import { buildNLMCitation } from './Citation';
import * as stories from './Citation.stories';

const { Citation } = composeStories(stories);

const defaultCitation = 'Aanders A, Banders B, Canders C. Something Science-y [Internet]. HuBMAP Consortium; 2018.';

test('builds NLM citation', () => {
  const { contributors = [], citationTitle = '', created_timestamp = 1520153805000 } = Citation.args;
  expect(buildNLMCitation(contributors, citationTitle, created_timestamp)).toEqual(defaultCitation);
});

test('Displays correct text', () => {
  render(<Citation />);
  const {
    args: { doi, doi_url },
  } = Citation;
  expect(screen.getByText((content) => content.startsWith(defaultCitation))).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View DataCite Page' })).toHaveAttribute(
    'href',
    `https://commons.datacite.org/doi.org/${doi}`,
  );
  expect(screen.getByRole('link', { name: doi_url })).toHaveAttribute('href', doi_url);
});
