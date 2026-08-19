import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor, within, appProviderEndpoints } from 'test-utils/functions';
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

/** One representative document per dataset -- no `inner_hits`, which is the point of the design. */
function collapsedHit(datasetUuid: string, hubmapId: string, relPath: string) {
  return {
    _id: `${datasetUuid}/${relPath}`,
    _source: {
      dataset_uuid: datasetUuid,
      dataset_hubmap_id: hubmapId,
      dataset_type: 'RNAseq [Salmon]',
      data_class: 'Processed Dataset',
      data_access_level: 'public',
      organs: [{ label: 'Spleen' }, { label: 'Spleen' }],
      rel_path: relPath,
    },
  };
}

const hitsResponse = {
  hits: {
    total: { value: 3, relation: 'eq' },
    hits: [
      collapsedHit('uuid-a', 'HBM111.AAAA.111', 'expr.h5ad'),
      collapsedHit('uuid-b', 'HBM222.BBBB.222', 'secondary.h5ad'),
    ],
  },
};

/** Exact per-dataset counts and sizes, which replaced summing a truncated inner-hit list. */
const statsResponse = {
  aggregations: {
    by_dataset: {
      buckets: [
        { key: 'uuid-a', doc_count: 2, bytes: { value: 3000 } },
        { key: 'uuid-b', doc_count: 1, bytes: { value: 500 } },
      ],
    },
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
let statsRequestBodies: Record<string, unknown>[] = [];
let facetsRequestBodies: Record<string, unknown>[] = [];

const server = setupServer(
  http.get(`/${appProviderEndpoints.baseElasticsearchEndpoint}/files/mapping`, () => HttpResponse.json(filesMapping)),
  http.post(`/${appProviderEndpoints.filesElasticsearchEndpoint}`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    // The rows request and the per-page stats request both go to the index; the stats one asks for
    // aggregations with no hits.
    if (body.aggs) {
      statsRequestBodies.push(body);
      return HttpResponse.json(statsResponse);
    }
    hitsRequestBodies.push(body);
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
  statsRequestBodies = [];
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
    await waitFor(() => expect(statsRequestBodies.length).toBeGreaterThan(0));

    const hitsBody = hitsRequestBodies[0];
    // One row per dataset, and no `uuid.keyword` sort -- the index has no `uuid` field, and
    // sorting on an unmapped field is a hard Elasticsearch error.
    expect(hitsBody.collapse).toMatchObject({ field: 'dataset_uuid.keyword' });
    expect(JSON.stringify(hitsBody.sort)).not.toContain('"uuid.keyword"');
    // Aggregations are not requested alongside the hits; that is the whole point of the split.
    expect(hitsBody.aggs).toBeUndefined();
    // No `inner_hits`: requesting the grouped documents is what made this query cost seconds.
    expect(JSON.stringify(hitsBody.collapse)).not.toContain('inner_hits');

    const facetsBody = facetsRequestBodies[0];
    expect(facetsBody.size).toBe(0);
    expect(facetsBody.collapse).toBeUndefined();
    expect(Object.keys(facetsBody.aggs as Record<string, unknown>)).toContain('total_groups');

    // Per-page stats are scoped to the rendered datasets, which is what keeps them cheap.
    const statsBody = statsRequestBodies[0];
    expect(statsBody.size).toBe(0);
    expect(statsBody.collapse).toBeUndefined();
    expect(JSON.stringify(statsBody.query)).toContain('uuid-a');
  });

  test('renders one row per dataset', async () => {
    render(<Files />);

    await waitFor(() => {
      expect(screen.getByTestId('files-search-results-table')).toBeInTheDocument();
    });

    expect(await screen.findByText('HBM111.AAAA.111')).toBeInTheDocument();
    expect(screen.getByText('HBM222.BBBB.222')).toBeInTheDocument();

    // Repeated organs are collapsed to one label.
    expect(screen.getAllByText('Spleen')).toHaveLength(2);
  });

  test('shows exact per-dataset counts and sizes from the stats aggregation', async () => {
    render(<Files />);

    // Exact, and independent of how many documents the hits request happened to return -- summing a
    // truncated inner-hit list is what previously produced an understated "≥" size.
    expect(await screen.findByText(/2 files — select/)).toBeInTheDocument();
    expect(screen.getByText(/1 file — select/)).toBeInTheDocument();
    expect(screen.getByText('3 kB')).toBeInTheDocument();
    expect(screen.getByText('500 B')).toBeInTheDocument();
  });

  test('has no row expander, and no file-type chips', async () => {
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');

    // Both were removed: the chips carried no action and wasted horizontal space, and the file list
    // now lives in the picker rather than inline. Scoped to the table because `.h5ad` legitimately
    // appears in the facet sidebar.
    expect(screen.queryByRole('button', { name: /^Expand / })).not.toBeInTheDocument();
    const table = screen.getByTestId('files-search-results-table');
    expect(within(table).queryByText('.h5ad')).not.toBeInTheDocument();
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

  test('selecting a dataset row enables the download action', async () => {
    render(<Files />);

    const downloadButton = await screen.findByRole('button', { name: 'Download Files' });
    expect(downloadButton).toBeDisabled();

    const checkbox = await screen.findByRole('checkbox', { name: 'Select all files in HBM111.AAAA.111' });
    await userEvent.click(checkbox);

    await waitFor(() => expect(downloadButton).toBeEnabled());
    expect(screen.getByText(/1 dataset selected/)).toBeInTheDocument();
  });

  test('offers a filename filter distinct from free-text search', async () => {
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');

    // Free text cannot do this: the analyzed path field only matches whole path segments, and a
    // `*...*` term typed into the free-text box is routed to the dataset ID field.
    expect(screen.getByLabelText('Filter by file or folder name')).toBeInTheDocument();
    expect(screen.getByLabelText('Freetext search')).toBeInTheDocument();
  });

  test('applies the filename filter as a case-insensitive contains query', async () => {
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');

    await userEvent.type(screen.getByLabelText('Filter by file or folder name'), 'expr');

    const wildcardBodies = () =>
      hitsRequestBodies.map((body) => JSON.stringify(body)).filter((body) => body.includes('wildcard'));

    await waitFor(() => expect(wildcardBodies().length).toBeGreaterThan(0), { timeout: 5000 });

    // Contains, not a prefix: the path field is analyzed into whole segments, so a fragment needs
    // the leading wildcard to match at all.
    const latest = wildcardBodies().at(-1);
    expect(latest).toContain('"*expr*"');
    expect(latest).toContain('rel_path.keyword');
    expect(latest).toContain('case_insensitive');
  });

  test('keeps facets mounted while a filter change reloads them', async () => {
    // The bug this guards: the facets request keys on the filter state, so without
    // `keepPreviousData` its data resets to undefined mid-flight, every facet renders nothing, and
    // the whole sidebar visibly disappears as the user clicks.
    render(<Files />);

    const facetLabel = await screen.findByText('File Type');
    expect(facetLabel).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Filter by file or folder name'), 'expr');

    // Present continuously, not merely present again once the new response lands.
    expect(screen.getByText('File Type')).toBeInTheDocument();
    await waitFor(
      () => expect(facetsRequestBodies.some((body) => JSON.stringify(body).includes('wildcard'))).toBe(true),
      { timeout: 5000 },
    );
    expect(screen.getByText('File Type')).toBeInTheDocument();
  });
});
