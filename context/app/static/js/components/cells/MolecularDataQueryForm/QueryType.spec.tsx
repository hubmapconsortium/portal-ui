import React from 'react';
import { render, screen } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import QueryType from './QueryType';
import MolecularDataQueryFormProvider from './MolecularDataQueryFormProvider';
import MolecularDataQueryFormTrackingProvider from './MolecularDataQueryFormTrackingProvider';

function renderQueryType() {
  return render(
    <MolecularDataQueryFormTrackingProvider>
      <MolecularDataQueryFormProvider>
        <QueryType />
      </MolecularDataQueryFormProvider>
    </MolecularDataQueryFormTrackingProvider>,
  );
}

test('offers gene and cell type, and lists protein last as deprecated and disabled', async () => {
  renderQueryType();
  await userEvent.click(screen.getByRole('combobox', { name: /query type/i }));

  const options = screen.getAllByRole('option');
  expect(options.map((option) => option.textContent)).toEqual(['Gene', 'Cell Type', 'Protein (Deprecated)']);

  // MUI omits aria-disabled entirely on selectable items.
  expect(options[0]).not.toHaveAttribute('aria-disabled');
  expect(options[1]).not.toHaveAttribute('aria-disabled');
  expect(options[2]).toHaveAttribute('aria-disabled', 'true');
});
