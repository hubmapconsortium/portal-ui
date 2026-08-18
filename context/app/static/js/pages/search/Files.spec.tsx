import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor, appProviderEndpoints } from 'test-utils/functions';
import Files from './Files';

/** Only the fields the files search reads, with the `.keyword` subfields it resolves against. */
const filesMapping = {
  hm_public_files: {
    mappings: {
      properties: Object.fromEntries(
        [
          'dataset_uuid',
          'dataset_hubmap_id',
          'rel_path',
          'file_extension',
          'dataset_type',
          'data_class',
          'dataset_status',
          'data_access_level',
          'analyte_class',
          'is_qa_qc',
          'is_data_product',
          'description',
        ].map((field) => [field, { type: 'text', fields: { keyword: { type: 'keyword' } } }]),
      ),
    },
  },
};
// `organs` is an object array, which is why its facet is flat rather than hierarchical.
filesMapping.hm_public_files.mappings.properties.organs = {
  properties: {
    label: { type: 'text', fields: { keyword: { type: 'keyword' } } },
    hierarchy: { type: 'text', fields: { keyword: { type: 'keyword' } } },
  },
} as never;

function collapsedHit(datasetUuid: string, hubmapId: string, files: { rel_path: string; size: number }[]) {
  return {
    _id: `${datasetUuid}/${files[0].rel_path}`,
    _source: {
      dataset_uuid: datasetUuid,
      dataset_hubmap_id: hubmapId,
      dataset_type: 'RNAseq [Salmon]',
      data_class: 'Processed Dataset',
      data_access_level: 'public',
      organs: [{ label: 'Spleen' }, { label: 'Spleen' }],
      ...files[0],
    },
    inner_hits: {
      files: {
        hits: {
          total: { value: files.length },
          hits: files.map((file) => ({ _source: { ...file, file_extension: '.h5ad' } })),
        },
      },
    },
  };
}

const hitsResponse = {
  hits: {
    total: { value: 3, relation: 'eq' },
    hits: [
      collapsedHit('uuid-a', 'HBM111.AAAA.111', [
        { rel_path: 'expr.h5ad', size: 1000 },
        { rel_path: 'raw_expr.h5ad', size: 2000 },
      ]),
      collapsedHit('uuid-b', 'HBM222.BBBB.222', [{ rel_path: 'secondary.h5ad', size: 500 }]),
    ],
  },
};

const facetsResponse = {
  aggregations: {
    total_groups: { doc_count: 3, total_groups: { value: 2 } },
    file_extension: {
      doc_count: 3,
      file_extension: { buckets: [{ key: '.h5ad', doc_count: 3 }] },
    },
    dataset_type: {
      doc_count: 3,
      dataset_type: { buckets: [{ key: 'RNAseq [Salmon]', doc_count: 3 }] },
    },
    // Empty on purpose: an empty facet should not render an accordion.
    analyte_class: { doc_count: 0, analyte_class: { buckets: [] } },
  },
};

let hitsRequestBodies: Record<string, unknown>[] = [];
let facetsRequestBodies: Record<string, unknown>[] = [];

const server = setupServer(
  http.get(`/${appProviderEndpoints.baseElasticsearchEndpoint}/files/mapping`, () => HttpResponse.json(filesMapping)),
  http.post(`/${appProviderEndpoints.filesElasticsearchEndpoint}`, async ({ request }) => {
    hitsRequestBodies.push((await request.json()) as Record<string, unknown>);
    return HttpResponse.json(hitsResponse);
  }),
  http.post(`/${appProviderEndpoints.filesFacetsEndpoint}`, async ({ request }) => {
    facetsRequestBodies.push((await request.json()) as Record<string, unknown>);
    return HttpResponse.json(facetsResponse);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  hitsRequestBodies = [];
  facetsRequestBodies = [];
});
afterAll(() => server.close());

describe('Files search page', () => {
  // First, so SWR's cache is cold and the requests actually reach the mock server; later
  // tests in this file are served from that cache and issue no new requests.
  test('requests hits with collapse and facets from the cached endpoint', async () => {
    render(<Files />);

    await waitFor(() => expect(hitsRequestBodies.length).toBeGreaterThan(0));
    await waitFor(() => expect(facetsRequestBodies.length).toBeGreaterThan(0));

    const hitsBody = hitsRequestBodies[0];
    // One row per dataset, and no `uuid.keyword` sort -- the index has no `uuid` field, and
    // sorting on an unmapped field is a hard Elasticsearch error.
    expect(hitsBody.collapse).toMatchObject({ field: 'dataset_uuid.keyword' });
    expect(JSON.stringify(hitsBody.sort)).not.toContain('"uuid.keyword"');
    // Aggregations are not requested alongside the hits; that is the whole point of the split.
    expect(hitsBody.aggs).toBeUndefined();

    const facetsBody = facetsRequestBodies[0];
    expect(facetsBody.size).toBe(0);
    expect(facetsBody.collapse).toBeUndefined();
    expect(Object.keys(facetsBody.aggs as Record<string, unknown>)).toContain('total_groups');
  });

  test('renders one row per dataset with its files', async () => {
    render(<Files />);

    await waitFor(() => {
      expect(screen.getByTestId('files-search-results-table')).toBeInTheDocument();
    });

    expect(await screen.findByText('HBM111.AAAA.111')).toBeInTheDocument();
    expect(screen.getByText('HBM222.BBBB.222')).toBeInTheDocument();

    // Row-level file counts come from `inner_hits.total`, not the number returned.
    expect(screen.getByText(/2 files — select files/)).toBeInTheDocument();
    expect(screen.getByText(/1 file — select files/)).toBeInTheDocument();

    // Repeated organs are collapsed to one label.
    expect(screen.getAllByText('Spleen')).toHaveLength(2);
  });

  test('links each dataset to its detail page', async () => {
    render(<Files />);
    const link = await screen.findByRole('link', { name: 'HBM111.AAAA.111' });
    expect(link).toHaveAttribute('href', '/browse/HBM111.AAAA.111');
  });

  test('reports the dataset count rather than the file count', async () => {
    render(<Files />);
    // `hits.total` is 3 files; the rows are 2 datasets, from the group-count aggregation.
    expect(await screen.findByText(/2 Total Results/)).toBeInTheDocument();
  });

  test('hides a facet with no buckets but shows one with buckets', async () => {
    render(<Files />);

    expect(await screen.findByText('File Type')).toBeInTheDocument();
    // `analyte_class` came back with no buckets, so it must not render an empty accordion.
    expect(screen.queryByText('Analyte Class')).not.toBeInTheDocument();
  });

  test('selecting a dataset row enables the manifest download', async () => {
    render(<Files />);

    const manifestButton = await screen.findByRole('button', { name: 'Download Manifest' });
    expect(manifestButton).toBeDisabled();

    const checkbox = await screen.findByLabelText('Select all files in HBM111.AAAA.111');
    await userEvent.click(checkbox);

    await waitFor(() => expect(manifestButton).toBeEnabled());
    expect(screen.getByText(/1 dataset selected/)).toBeInTheDocument();
  });

  test('expanding a row lists its files', async () => {
    render(<Files />);

    const expand = await screen.findByRole('button', { name: 'Expand HBM111.AAAA.111' });
    await userEvent.click(expand);

    expect(await screen.findByText('expr.h5ad')).toBeInTheDocument();
    expect(screen.getByText('raw_expr.h5ad')).toBeInTheDocument();
  });
});
