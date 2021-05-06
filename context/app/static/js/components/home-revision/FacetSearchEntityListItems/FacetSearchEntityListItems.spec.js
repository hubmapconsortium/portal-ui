/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import FacetSearchEntityListItems from './FacetSearchEntityListItems';

test('should display correct text', () => {
  const fakeMatches = {
    super_heroes: [{ key: 'Spiderman' }, { key: 'Wolverine' }],
    super_villains: [{ key: 'Green Goblin' }, { key: 'Sabertooth' }],
  };
  const fakeEntityType = 'Marvel';
  render(
    <FacetSearchEntityListItems
      entityType={fakeEntityType}
      matches={fakeMatches}
      labels={{ super_heroes: 'Super Heroes', super_villains: 'Super Villains' }}
    />,
  );
  expect(screen.getByText('Super Heroes (Marvels)')).toBeInTheDocument();

  ['Wolverine', 'Spiderman'].forEach((field) =>
    expect(screen.getByRole('link', { name: field })).toHaveAttribute(
      'href',
      `/search?entity_type[0]=${fakeEntityType}&super_heroes[0]=${encodeURIComponent(field)}`,
    ),
  );

  expect(screen.getByText('Super Villains (Marvels)')).toBeInTheDocument();

  ['Green Goblin', 'Sabertooth'].forEach((field) =>
    expect(screen.getByRole('link', { name: field })).toHaveAttribute(
      'href',
      `/search?entity_type[0]=${fakeEntityType}&super_villains[0]=${encodeURIComponent(field)}`,
    ),
  );
});

test('should have correct href for mapped_data_access_level', () => {
  const fakeMatches = { mapped_data_access_level: [{ key: 'Apple' }] };
  const fakeEntityType = 'Pear';
  render(
    <FacetSearchEntityListItems
      entityType={fakeEntityType}
      matches={fakeMatches}
      labels={{ mapped_data_access_level: 'Status' }}
    />,
  );

  expect(screen.getByRole('link', { name: 'Apple' })).toHaveAttribute(
    'href',
    `/search?entity_type[0]=${fakeEntityType}&mapped_status-mapped_data_access_level[0][0]=Published&mapped_status-mapped_data_access_level[1][0]=Apple`,
  );
});
