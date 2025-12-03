import React, { ReactElement, ReactNode, useEffect } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { ProvenanceStoreProvider, useProvenanceStore } from '../ProvContext';
import { convertProvDataToNodesAndEdges } from '../utils/provToNodesAndEdges';
import { applyLayout } from '../utils/applyLayout';
import { createGetNameForActivity, createGetNameForEntity } from '../utils/nameFormatters';
import sampleProv, { sampleDescendantsProv } from './fixtures/sample_prov';

import ProvGraph from './ProvGraph';

const descendantData = {
  hits: {
    hits: [
      {
        _source: {
          immediate_descendants: [
            {
              uuid: sampleDescendantsProv[0].uuid,
            },
            {
              uuid: sampleDescendantsProv[1].uuid,
            },
          ],
        },
      },
    ],
  },
};

const server = setupServer(
  http.post(`/${appProviderEndpoints.elasticsearchEndpoint}`, () => {
    return HttpResponse.json(descendantData);
  }),
  http.get(`/${appProviderEndpoints.entityEndpoint}/entities/${sampleDescendantsProv[0].uuid}/provenance`, () => {
    return HttpResponse.json(sampleDescendantsProv[0].prov);
  }),
  http.get(`/${appProviderEndpoints.entityEndpoint}/entities/${sampleDescendantsProv[1].uuid}/provenance`, () => {
    return HttpResponse.json(sampleDescendantsProv[1].prov);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

interface RenderWithProvContextOptions {
  initialUuid?: string;
  initialUuids?: string[];
  flaskData?: unknown;
  provData?: typeof sampleProv;
  entityType?: string;
}

function renderWithProvContext(
  ui: ReactElement,
  {
    initialUuid = '',
    initialUuids = [],
    flaskData,
    provData,
    entityType = 'Sample',
  }: RenderWithProvContextOptions = {},
) {
  // Determine if this is old or new provenance format
  const isOld = provData && 'ex' in provData?.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  // Component that initializes the store with nodes/edges
  function StoreInitializer({ children }: { children: ReactNode }) {
    const setNodesAndEdges = useProvenanceStore((state) => state.setNodesAndEdges);

    useEffect(() => {
      if (provData) {
        const { nodes: rawNodes, edges: rawEdges } = convertProvDataToNodesAndEdges(provData, {
          currentUuid: initialUuid,
          getNameForActivity: createGetNameForActivity(idKey),
          getNameForEntity: createGetNameForEntity(typeKey, idKey),
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

test('should display the correct initial nodes for a sample', () => {
  const sampleEntityText = 'Sample - HBM666.CHPF.373';
  const nodesText = ['Donor - HBM547.NCQL.874', 'Create Sample Activity', sampleEntityText];

  const notIncludedNodesText = ['hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a', 'Register Donor Activity'];

  renderWithProvContext(<ProvGraph provData={sampleProv} entity_type="Sample" uuid="" />, {
    initialUuid: '',
    initialUuids: [],
    provData: sampleProv,
    entityType: 'Sample',
  });

  nodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  notIncludedNodesText.forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());
});

test('should display selected node information in detail pane and show immediate descendants when "Show Derived Entities" button is clicked', async () => {
  renderWithProvContext(<ProvGraph provData={sampleProv} entity_type="Sample" uuid="" />, {
    initialUuid: '',
    initialUuids: [],
    provData: sampleProv,
    entityType: 'Sample',
  });

  const sampleEntityText = 'Sample - HBM666.CHPF.373';
  const detailPaneText = ['Type', 'Sample', 'ID', 'HBM666.CHPF.373', 'Created', '2019-11-01', '18:50:35'];

  fireEvent.click(screen.getByText(sampleEntityText));

  detailPaneText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getByRole('link', { name: 'HBM666.CHPF.373' })).toHaveAttribute(
    'href',
    '/browse/sample/13129ad371683171b152618c83fd9e6f',
  );

  const derivedEntitiesButton = screen.getByRole('button', { name: 'Show Derived Entities' });

  expect(derivedEntitiesButton).toBeDisabled();

  detailPaneText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  await waitFor(() => expect(derivedEntitiesButton).toBeEnabled());
});

test("should display an asterisk in the current page's node", () => {
  renderWithProvContext(
    <ProvGraph provData={sampleProv} entity_type="Sample" uuid="13129ad371683171b152618c83fd9e6f" />,
    {
      initialUuid: '13129ad371683171b152618c83fd9e6f',
      initialUuids: ['13129ad371683171b152618c83fd9e6f'],
      provData: sampleProv,
      entityType: 'Sample',
    },
  );
  expect(screen.getByText('Sample - HBM666.CHPF.373')).toBeInTheDocument();
  expect(screen.getByLabelText('Current entity')).toBeInTheDocument();
});
