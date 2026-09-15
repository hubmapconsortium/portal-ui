import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';

import useCellTypeCountForDataset from './useCellTypeCountForDataset';
import useCellTypeCountForTissue from './useCellTypeCountForTissue';
import useCellTypeExpressionBins from './useCellTypeExpression';
import useCellTypeMarkers from './useCellTypeMarkers';
import useCellTypeNames from './useCellTypeNames';
import useCLIDToLabel from './useCLIDToLabel';
import useEvaluateMarkers from './useEvaluateMarkers';
import useFindCellTypeSpecificities from './useFindCellTypeSpecificities';
import useFindDatasetForCellTypes from './useFindDatasetForCellTypes';
import useFindDatasetForGenes from './useFindDatasetForGenes';
import useFindGeneSignatures from './useFindGeneSignatures';
import useFindHouseKeepingGenes from './useFindHouseKeepingGenes';
import useFindSimilarGenes from './useFindSimilarGenes';
import useFindTissueSpecificities from './useFindTissueSpecificities';
import useHyperQueryCellTypes from './useHyperQueryCellTypes';
import useIndexedDatasets from './useIndexedDatasets';
import useLabelToCLID from './useLabelToCLID';
import useMarkerGenes from './useMarkerGenes';
import useScfindGenes from './useSCFindGenes';

// These hooks are thin wrappers over the Flask BFF routes, so there are two things worth
// pinning down per hook: the route and query params it asks for, and the shape it hands back
// once its transform has run. Anything the hook doesn't reshape is asserted as a passthrough.
//
// This replaces the nineteen per-hook story files that used to serve the same purpose by
// hitting the live dev API, which meant they could never run in CI. The remaining explorer
// story (ScFindExplorer.stories.tsx) covers the "what does the real API return" case.

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

function Wrapper({ children }: PropsWithChildren) {
  // Fresh cache per case, so one case's response can never satisfy another case's key.
  return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>;
}

interface HookCase {
  /** Hook under test, returning the value the assertion runs against. Named `useHook` so
   *  the rules-of-hooks lint recognizes it as a hook. */
  useHook: () => unknown;
  route: string;
  /** Every query param the request is expected to carry, and nothing else. */
  params: Record<string, string>;
  /** Body the BFF route returns. */
  response: object;
  /** What `useHook` should settle on. */
  expected: unknown;
}

const cellType = 'Kidney.T cell';

const cases: Record<string, HookCase> = {
  useCellTypeNames: {
    useHook: () => useCellTypeNames().data,
    route: '/scfind/cell-type-names.json',
    params: {},
    response: { cell_types: [cellType, 'Kidney.other'] },
    // `other` is dropped and the key is renamed for callers.
    expected: { cellTypeNames: [cellType] },
  },
  useIndexedDatasets: {
    useHook: () => useIndexedDatasets().data,
    route: '/scfind/indexed-datasets.json',
    params: {},
    response: { datasets: ['HBM1', 'HBM2'], counts: [3, 5] },
    // The parallel datasets/counts arrays are zipped into a lookup.
    expected: { datasets: ['HBM1', 'HBM2'], counts: [3, 5], countsMap: { HBM1: 3, HBM2: 5 } },
  },
  useScfindGenes: {
    useHook: () => useScfindGenes('rna').data,
    route: '/scfind/genes.json',
    params: { modality: 'rna' },
    response: { genes: ['CD4'] },
    expected: { genes: ['CD4'] },
  },
  useMarkerGenes: {
    useHook: () => useMarkerGenes({ markerGenes: ['CD4', 'MMRN1'], datasetName: 'HBM1' }).data,
    route: '/scfind/marker-genes.json',
    params: { marker_genes: 'CD4,MMRN1', dataset_name: 'HBM1' },
    response: [{ cellType }],
    expected: [{ cellType }],
  },
  useCellTypeMarkers: {
    useHook: () => useCellTypeMarkers({ cellTypes: cellType }).data,
    route: '/scfind/cell-type-markers.json',
    // topK, sortField and includePrefix are defaulted by the hook, not the caller.
    params: { cell_types: cellType, top_k: '10', include_prefix: 'true', sort_field: 'f1' },
    response: { findGeneSignatures: [{ cellType, f1: 1 }] },
    expected: { findGeneSignatures: [{ cellType, f1: 1 }] },
  },
  useCellTypeCountForDataset: {
    useHook: () => useCellTypeCountForDataset({ dataset: 'HBM1' }).data,
    route: '/scfind/cell-type-count-for-dataset.json',
    params: { dataset: 'HBM1' },
    response: { cellTypeCounts: [{ count: 3, index: cellType }] },
    expected: { cellTypeCounts: [{ count: 3, index: cellType }] },
  },
  useCellTypeCountForTissue: {
    useHook: () => useCellTypeCountForTissue({ tissue: 'Kidney' }).data,
    route: '/scfind/cell-type-count-for-tissue.json',
    params: { tissue: 'Kidney' },
    response: { cellTypeCounts: [{ cell_count: 3, index: cellType }] },
    expected: { cellTypeCounts: [{ cell_count: 3, index: cellType }] },
  },
  useCellTypeExpressionBins: {
    useHook: () => useCellTypeExpressionBins({ geneList: 'CD4', datasetName: 'HBM762.RPDR.282' }).data,
    route: '/scfind/cell-type-expression-bins.json',
    // The dataset name is doubled up, dots swapped for dashes in the first half. That is what
    // the API expects, odd as it looks.
    params: { gene_list: 'CD4', cell_type: 'HBM762-RPDR-282.HBM762.RPDR.282', bin_length: '1' },
    response: { CD4: { '0-1': 238 } },
    expected: { CD4: { '0-1': 238 } },
  },
  useCLIDToLabel: {
    // Fetches the whole CLID map and looks the one CLID up client-side.
    useHook: () => useCLIDToLabel({ clid: 'CL:0000084' }).data,
    route: '/scfind/clid-to-label-map.json',
    params: {},
    response: { 'CL:0000084': [cellType], 'CL:0000000': ['Kidney.other'] },
    expected: [cellType],
  },
  useLabelToCLID: {
    useHook: () => useLabelToCLID({ cellType }).data,
    route: '/scfind/label-to-clid-map.json',
    params: {},
    response: { [cellType]: ['CL:0000084'] },
    expected: { CLIDs: ['CL:0000084'] },
  },
  useEvaluateMarkers: {
    useHook: () => useEvaluateMarkers({ geneList: ['CD4'], cellTypes: [cellType] }).data,
    route: '/scfind/evaluate-markers.json',
    params: { gene_list: 'CD4', cell_types: cellType },
    response: { evaluateMarkers: [] },
    expected: { evaluateMarkers: [] },
  },
  useFindCellTypeSpecificities: {
    useHook: () => useFindCellTypeSpecificities({ geneList: 'CD4', minCells: 10 }).data,
    route: '/scfind/find-cell-type-specificities.json',
    params: { gene_list: 'CD4', min_cells: '10' },
    response: { cellTypeSpecificities: [] },
    expected: { cellTypeSpecificities: [] },
  },
  useFindDatasetForCellTypes: {
    useHook: () => useFindDatasetForCellTypes({ cellTypes: [cellType] }).countsMaps,
    route: '/scfind/find-dataset-for-cell-type.json',
    params: { cell_type: cellType },
    response: { counts: [3], datasets: ['HBM1'] },
    // Results are keyed back onto the cell type that was asked for.
    expected: { [cellType]: { HBM1: 3 } },
  },
  useFindDatasetForGenes: {
    useHook: () => useFindDatasetForGenes({ geneList: ['CD4'] }).data,
    route: '/scfind/find-datasets.json',
    params: { gene_list: 'CD4' },
    response: { counts: { CD4: [3] }, findDatasets: { CD4: ['HBM1'] } },
    expected: { counts: { CD4: [3] }, findDatasets: { CD4: ['HBM1'] } },
  },
  useFindGeneSignatures: {
    useHook: () => useFindGeneSignatures({ cellTypes: cellType, minCells: 10 }).data,
    route: '/scfind/find-gene-signatures.json',
    params: { cell_types: cellType, min_cells: '10' },
    response: { evaluateMarkers: [] },
    expected: { evaluateMarkers: [] },
  },
  useFindHouseKeepingGenes: {
    useHook: () => useFindHouseKeepingGenes({ cellTypes: cellType, minRecall: 0.5, maxGenes: 5 }).data,
    route: '/scfind/find-housekeeping-genes.json',
    params: { cell_types: cellType, min_recall: '0.5', max_genes: '5' },
    response: { findHouseKeepingGenes: [] },
    expected: { findHouseKeepingGenes: [] },
  },
  useFindSimilarGenes: {
    useHook: () => useFindSimilarGenes({ geneList: 'CD4', datasetName: 'HBM1', topK: 5 }).data,
    route: '/scfind/find-similar-genes.json',
    params: { gene_list: 'CD4', dataset_name: 'HBM1', top_k: '5' },
    response: { evaluateMarkers: [] },
    expected: { evaluateMarkers: [] },
  },
  useFindTissueSpecificities: {
    useHook: () => useFindTissueSpecificities({ geneList: 'CD4', minCells: 10 }).data,
    route: '/scfind/find-tissue-specificities.json',
    params: { gene_list: 'CD4', min_cells: '10' },
    response: { evaluateMarkers: [] },
    expected: { evaluateMarkers: [] },
  },
  useHyperQueryCellTypes: {
    useHook: () => useHyperQueryCellTypes({ geneList: 'CD4', organName: 'Kidney' }).data,
    route: '/scfind/hyper-query-cell-types.json',
    // `dataset_name` really does carry an organ name here; `include_prefix` defaults to true.
    params: { gene_list: 'CD4', dataset_name: 'Kidney', include_prefix: 'true' },
    response: { findGeneSignatures: [] },
    expected: { findGeneSignatures: [] },
  },
};

describe.each(Object.entries(cases))('%s', (_name, { useHook, route, params, response, expected }) => {
  it('requests the expected route and returns the expected shape', async () => {
    let requested: URL | undefined;
    server.use(
      http.get(route, ({ request }) => {
        requested = new URL(request.url);
        return HttpResponse.json(response);
      }),
    );

    const { result } = renderHook(useHook, { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current).toEqual(expected);
    });

    expect(requested?.pathname).toBe(route);
    expect(Object.fromEntries(requested!.searchParams)).toEqual(params);
  });
});

// The comma workaround is the one branch that changes the request method, so it gets its own case.
test('useCellTypeMarkers posts when a cell type name contains a comma', async () => {
  const commaCellType = 'Kidney.T cell, activated';
  let body: unknown;
  server.use(
    http.post('/scfind/cell-type-markers.json', async ({ request }) => {
      body = await request.json();
      return HttpResponse.json({ findGeneSignatures: [] });
    }),
  );

  const { result } = renderHook(() => useCellTypeMarkers({ cellTypes: commaCellType }).data, { wrapper: Wrapper });

  await waitFor(() => {
    expect(result.current).toEqual({ findGeneSignatures: [] });
  });

  expect(body).toEqual({
    cell_types: [commaCellType],
    top_k: 10,
    include_prefix: true,
    sort_field: 'f1',
  });
});
