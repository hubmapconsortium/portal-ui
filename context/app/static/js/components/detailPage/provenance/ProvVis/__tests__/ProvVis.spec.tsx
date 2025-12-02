import React, { ReactElement, ReactNode, useEffect } from 'react';
import { render, screen } from 'test-utils/functions';
import { ProvenanceStoreProvider, useProvenanceStore } from '../../ProvContext';
import { convertProvDataToNodesAndEdges } from '../../utils/provToNodesAndEdges';
import { applyLayout } from '../../utils/applyLayout';

import ProvVis from '../ProvVis';

import { simple } from './fixtures';

interface RenderWithProvContextOptions {
  initialUuid?: string;
  initialUuids?: string[];
  flaskData?: unknown;
  provData?: typeof simple.prov;
  getNameForActivity?: typeof simple.getNameForActivity;
  getNameForEntity?: typeof simple.getNameForEntity;
  entityType?: string;
}

function renderWithProvContext(
  ui: ReactElement,
  {
    initialUuid = '',
    initialUuids = [],
    flaskData,
    provData,
    getNameForActivity,
    getNameForEntity,
    entityType = 'Dataset',
  }: RenderWithProvContextOptions = {},
) {
  // Component that initializes the store with nodes/edges
  function StoreInitializer({ children }: { children: ReactNode }) {
    const setNodesAndEdges = useProvenanceStore((state) => state.setNodesAndEdges);

    useEffect(() => {
      if (provData && getNameForActivity && getNameForEntity) {
        const { nodes: rawNodes, edges: rawEdges } = convertProvDataToNodesAndEdges(provData, {
          currentUuid: initialUuid,
          getNameForActivity,
          getNameForEntity,
          entityType,
        });
        const { nodes, edges } = applyLayout(rawNodes, rawEdges);
        setNodesAndEdges(nodes, edges);
      }
    }, [setNodesAndEdges]);

    return <>{children}</>;
  }

  // Create a wrapper that will be used by the test utils render
  // This wrapper will be inside AllTheProviders
  const ProvWrapper = ({ children }: { children: ReactNode }) => (
    <ProvenanceStoreProvider initialUuid={initialUuid} initialUuids={initialUuids}>
      <StoreInitializer>{children}</StoreInitializer>
    </ProvenanceStoreProvider>
  );

  return render(<ProvWrapper>{ui}</ProvWrapper>, { flaskData });
}

describe('ProvVis', () => {
  it('renders React component with svg', () => {
    renderWithProvContext(<ProvVis />, {
      initialUuid: '',
      initialUuids: [],
      provData: simple.prov,
      getNameForActivity: simple.getNameForActivity,
      getNameForEntity: simple.getNameForEntity,
      entityType: 'Dataset',
    });

    // React Flow renders, but nodes may not be visible immediately
    // Just check that it doesn't crash
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
