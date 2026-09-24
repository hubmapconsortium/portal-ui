import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import history from 'history/browser';

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

/**
 * Unfiltered totals, deliberately larger than the filtered counts above: selecting a dataset in full
 * takes every file in it, not only the ones matching the query.
 */
const wholeCountsResponse = {
  aggregations: {
    by_dataset: {
      buckets: [
        { key: 'uuid-a', doc_count: 7 },
        { key: 'uuid-b', doc_count: 4 },
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
    // Flat buckets: the index has no parent field, so the Dataset Type hierarchy is grouped from
    // these in the browser.
    dataset_type: {
      doc_count: 6,
      dataset_type: {
        buckets: [
          { key: 'RNAseq', doc_count: 1 },
          { key: 'RNAseq [Salmon]', doc_count: 3 },
          { key: 'RNAseq [SnapATAC]', doc_count: 2 },
        ],
      },
    },
    // Empty on purpose: an empty facet should not render an accordion.
    analyte_class: { doc_count: 0, analyte_class: { buckets: [] } },
  },
};

let hitsRequestBodies: Record<string, unknown>[] = [];
let statsRequestBodies: Record<string, unknown>[] = [];
let wholeCountsRequestBodies: Record<string, unknown>[] = [];
let facetsRequestBodies: Record<string, unknown>[] = [];

const server = setupServer(
  http.get(`/${appProviderEndpoints.baseElasticsearchEndpoint}/files/mapping`, () => HttpResponse.json(filesMapping)),
  http.post(`/${appProviderEndpoints.filesElasticsearchEndpoint}`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    // The rows request and the per-page stats request both go to the index; the stats one asks for
    // aggregations with no hits.
    if (body.aggs) {
      // Both aggregate by dataset; only the per-page stats request sums file sizes, and only the
      // whole-dataset count request is issued without the page's filters.
      const aggs = body.aggs as { by_dataset?: { aggs?: unknown } };
      if (!aggs.by_dataset?.aggs) {
        wholeCountsRequestBodies.push(body);
        return HttpResponse.json(wholeCountsResponse);
      }
      statsRequestBodies.push(body);
      return HttpResponse.json(statsResponse);
    }
    hitsRequestBodies.push(body);
    // Honour a filename filter, so that narrowing the results changes which datasets are on the page.
    const fragment = /"\*([^*"]+)\*"/.exec(JSON.stringify(body))?.[1];
    if (fragment) {
      const hits = hitsResponse.hits.hits.filter((hit) => hit._source.rel_path.includes(fragment));
      return HttpResponse.json({ hits: { ...hitsResponse.hits, total: { value: hits.length, relation: 'eq' }, hits } });
    }
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
  wholeCountsRequestBodies = [];
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
    expect(await screen.findByText('Choose Files (2)')).toBeInTheDocument();
    expect(screen.getByText('Choose Files (1)')).toBeInTheDocument();
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
    // The count is of *files*, and for a whole dataset it is the unfiltered total (7 here), not the
    // 2 files that match the active query -- the manifest's directory line brings all of them.
    expect(await screen.findByText('7 files selected')).toBeInTheDocument();
    // And the checkbox now offers to undo the file selection, not to remove the dataset.
    expect(screen.getByRole('checkbox', { name: 'Deselect all files in HBM111.AAAA.111' })).toBeInTheDocument();
  });

  test('hides "add all matching" until something narrows the results', async () => {
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');

    // Unfiltered the action can only refuse: every file in the index matches.
    expect(screen.queryByRole('button', { name: /Add All Matching Files/ })).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Filter by file or folder name'), 'expr');

    expect(await screen.findByRole('button', { name: /Add All Matching Files/ })).toBeInTheDocument();
  });

  test('groups dataset types under their derived raw assay', async () => {
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');
    // Scoped to the sidebar: `dataset_type` is also a table column, so the page renders both.
    const facets = within(screen.getByTestId('search-facets'));

    // `RNAseq` is not a value in the index; it is `dataset_type` with the pipeline suffix stripped,
    // which is how the portal index derives `raw_dataset_type`. Its count is the sum of its
    // children's, and the children stay collapsed until the row is expanded.
    expect(facets.getByText('RNAseq')).toBeInTheDocument();
    expect(facets.getByText('6')).toBeInTheDocument();
    expect(facets.queryByText('RNAseq [Salmon]')).not.toBeInTheDocument();

    await userEvent.click(facets.getByTitle('View More'));

    expect(await facets.findByText('RNAseq [Salmon]')).toBeInTheDocument();
    expect(facets.getByText('RNAseq [SnapATAC]')).toBeInTheDocument();
  });

  test('filters on child values, never on the derived parent', async () => {
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');

    // The label, not the checkbox: a parent and its children share an accessible name prefix, and
    // clicking the label toggles its control.
    await userEvent.click(within(screen.getByTestId('search-facets')).getByText('RNAseq'));

    const datasetTypeBodies = () =>
      hitsRequestBodies.map((body) => JSON.stringify(body)).filter((body) => body.includes('dataset_type.keyword'));

    await waitFor(() => expect(datasetTypeBodies().length).toBeGreaterThan(0), { timeout: 5000 });

    // Every child of the parent, and *no* bare "RNAseq" clause: selecting a parent seeds all its
    // children, and no document holds the derived value, so querying it would match nothing.
    const latest = datasetTypeBodies().at(-1)!;
    expect(latest).toContain('RNAseq [Salmon]');
    expect(latest).toContain('RNAseq [SnapATAC]');
    expect(latest).not.toContain('["RNAseq"]');
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

  test('requests stats only for the datasets a query actually returned', async () => {
    // The bug this guards: the rows keep the previous page on screen while a new query loads, so a
    // stats request keyed on the live filters would first pair the new filter with the old page's
    // datasets -- here asking about `uuid-a`, which no file named `*s*` belongs to.
    // Search state lives in the URL, and the tests above left a filename filter there.
    history.replace(history.location.pathname);
    render(<Files />);
    await screen.findByText('HBM111.AAAA.111');

    await userEvent.type(screen.getByLabelText('Filter by file or folder name'), 'sec');

    const filteredStatsBodies = () =>
      statsRequestBodies.map((body) => JSON.stringify(body)).filter((body) => body.includes('wildcard'));

    await waitFor(() => expect(filteredStatsBodies().some((body) => body.includes('"*sec*"'))).toBe(true), {
      timeout: 5000,
    });
    filteredStatsBodies().forEach((body) => expect(body).not.toContain('uuid-a'));
    expect(screen.queryByText('HBM111.AAAA.111')).not.toBeInTheDocument();
  });
});
