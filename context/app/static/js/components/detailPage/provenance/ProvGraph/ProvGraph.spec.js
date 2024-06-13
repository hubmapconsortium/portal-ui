import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { http } from 'msw';
import { setupServer } from 'msw/node';

// eslint-disable-next-line
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import sampleProv, { sampleDescendantsProv } from './fixtures/sample_prov';
import donorProv from './fixtures/donor_prov';

import ProvGraph from './ProvGraph';

// eslint-disable-next-line testing-library/no-node-access
document.getElementsByClassName = () => [
  {
    scroll: jest.fn(),
  },
];

const server = setupServer(
  http.post(`/${appProviderEndpoints.elasticsearchEndpoint}`, (req, res, ctx) => {
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
    return res(ctx.json(descendantData), ctx.status(200));
  }),
  http.get(
    `/${appProviderEndpoints.entityEndpoint}/entities/${sampleDescendantsProv[0].uuid}/provenance`,
    (req, res, ctx) => {
      return res(ctx.json(sampleDescendantsProv[0].prov), ctx.status(200));
    },
  ),
  http.get(
    `/${appProviderEndpoints.entityEndpoint}/entities/${sampleDescendantsProv[1].uuid}/provenance`,
    (req, res, ctx) => {
      return res(ctx.json(sampleDescendantsProv[1].prov), ctx.status(200));
    },
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should display the correct initial nodes for a donor', () => {
  const nodesText = [
    'hubmap:entities/308f5ffc-ed43-11e8-b56a-0e8017bdda58',
    'Register Donor Activity - HBM826.XCGC.423',
    'Donor - HBM528.WJLC.564',
  ];

  render(<ProvGraph provData={donorProv} entity_type="Donor" />);

  nodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('should display the correct initial nodes for a sample', () => {
  const sampleEntityText = 'Sample - HBM666.CHPF.373';
  const nodesText = ['Donor - HBM547.NCQL.874', 'Create Sample Activity - HBM665.NTZB.997', sampleEntityText];

  const notIncludedNodesText = [
    'hubmap:entities/73bb26e4-ed43-11e8-8f19-0a7c1eab007a',
    'Register Donor Activity - HBM398.NBBW.527',
  ];

  render(<ProvGraph provData={sampleProv} />);

  nodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  notIncludedNodesText.forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());
});

test('should display selected node information in detail pane and show immediate descendants when "Show Derived Entities" button is clicked', async () => {
  render(<ProvGraph provData={sampleProv} />);

  const sampleEntityText = 'Sample - HBM666.CHPF.373';
  const detailPaneText = ['Type', 'Sample', 'ID', 'HBM666.CHPF.373', 'Created', '2019-11-01T18:50:35'];

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

  /* TODO: After npm upgrade, the next line fails: */

  // fireEvent.click(derivedEntitiesButton);
  //
  // const newNodesText = [
  //   'Create Sample Activity - HBM358.MRDC.967',
  //   'Sample - HBM743.BZVB.466',
  //   'Create Sample Activity - HBM534.VGXH.932',
  //   'Sample - HBM643.FDGT.862',
  // ];
  //
  // await waitFor(() => newNodesText.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument()));
});

test("should display an asterisk in the current page's node", () => {
  render(<ProvGraph provData={sampleProv} entity_type="Sample" uuid="13129ad371683171b152618c83fd9e6f" />);
  expect(screen.getByTestId('Sample - HBM666.CHPF.373')).toContainElement(screen.getByText('*'));
});
