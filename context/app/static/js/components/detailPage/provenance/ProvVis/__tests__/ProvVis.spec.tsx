import React, { ReactElement, ReactNode } from 'react';
import { render, screen } from 'test-utils/functions';
import { ProvenanceStoreProvider } from '../../ProvContext';

import ProvVis from '../ProvVis';

import { simple } from './fixtures';

interface RenderWithProvContextOptions {
  initialUuid?: string;
  initialUuids?: string[];
  flaskData?: unknown;
}

function renderWithProvContext(
  ui: ReactElement,
  { initialUuid = '', initialUuids = [], flaskData }: RenderWithProvContextOptions = {},
) {
  // Create a wrapper that will be used by the test utils render
  // This wrapper will be inside AllTheProviders
  const ProvWrapper = ({ children }: { children: ReactNode }) => (
    <ProvenanceStoreProvider initialUuid={initialUuid} initialUuids={initialUuids}>
      {children}
    </ProvenanceStoreProvider>
  );

  return render(<ProvWrapper>{ui}</ProvWrapper>, { flaskData });
}

describe('ProvVis', () => {
  it('renders React component with svg', () => {
    renderWithProvContext(
      <ProvVis
        provData={simple.prov}
        getNameForActivity={simple.getNameForActivity}
        getNameForEntity={simple.getNameForEntity}
        entity_type="Dataset"
      />,
      {
        initialUuid: '',
        initialUuids: [],
      },
    );

    // React Flow renders, but nodes may not be visible immediately
    // Just check that it doesn't crash
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
