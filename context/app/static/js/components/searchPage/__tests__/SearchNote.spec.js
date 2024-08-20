import React from 'react';
import { render, screen } from 'test-utils/functions';

import SearchNote from '../SearchNote';

const entity = {
  uuid: 'FAKE_UUID',
  entity_type: 'FAKE_TYPE',
  hubmap_id: 'FAKE_DOI',
};

jest.mock('js/hooks/useEntityData', () => () => [entity, false]);

test('SearchNote renders for derived entities', async () => {
  const params = new URLSearchParams();
  params.append('ancestor_ids[0]', 'FAKE_UUID');
  render(<SearchNote params={params} />);
  expect(screen.getByText('Derived from fake_type')).toBeInTheDocument();
  const link = screen.getByText('FAKE_DOI');
  expect(link.href).toBe('http://localhost/browse/fake_type/FAKE_UUID');
});

test('SearchNote renders for ancestor entities', async () => {
  const params = new URLSearchParams();
  params.append('descendant_ids[0]', 'FAKE_UUID');
  render(<SearchNote params={params} />);
  expect(screen.getByText('Ancestor of fake_type')).toBeInTheDocument();
  const link = screen.getByText('FAKE_DOI');
  expect(link.href).toBe('http://localhost/browse/fake_type/FAKE_UUID');
});

test('SearchNote renders for entities related to a cell type', async () => {
  const params = new URLSearchParams();
  params.append('cell_type', 'FAKE_CELL_TYPE');
  render(<SearchNote params={params} />);
  expect(screen.getByText('Datasets containing FAKE_CELL_TYPE')).toBeInTheDocument();
});
