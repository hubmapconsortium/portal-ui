import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
import StoryControlTemplate from './StoryTemplate';

type Params = Record<string, unknown>;

// The `params` control hands back an untyped object; each runner narrows it to its own shape.
const narrow = <T,>(params: Params) => params as unknown as T;

/**
 * One entry per scFind hook: how to call it with a params object, and a set of params that
 * returns something interesting against the dev index.
 *
 * Request/response shapes are pinned down by `hooks.spec.tsx`. This story is for the other
 * question — what the live API actually gives back — so it deliberately hits the real thing.
 */
const hooks = {
  useCellTypeNames: {
    useHook: (p: Params) => useCellTypeNames(p.modality as string | undefined),
    defaultParams: {},
  },
  useIndexedDatasets: {
    useHook: (p: Params) => useIndexedDatasets(p.modality as string | undefined),
    defaultParams: {},
  },
  useScfindGenes: {
    useHook: (p: Params) => useScfindGenes(p.modality as string | undefined),
    defaultParams: {},
  },
  useMarkerGenes: {
    useHook: (p: Params) => useMarkerGenes(narrow<Parameters<typeof useMarkerGenes>[0]>(p)),
    defaultParams: { markerGenes: ['CD4', 'MMRN1'] },
  },
  useCellTypeMarkers: {
    useHook: (p: Params) => useCellTypeMarkers(narrow<Parameters<typeof useCellTypeMarkers>[0]>(p)),
    defaultParams: { cellTypes: 'Kidney.T cell' },
  },
  useCellTypeCountForDataset: {
    useHook: (p: Params) => useCellTypeCountForDataset(narrow<Parameters<typeof useCellTypeCountForDataset>[0]>(p)),
    defaultParams: { dataset: 'HBM279.TQRS.775' },
  },
  useCellTypeCountForTissue: {
    useHook: (p: Params) => useCellTypeCountForTissue(narrow<Parameters<typeof useCellTypeCountForTissue>[0]>(p)),
    defaultParams: { tissue: 'Kidney' },
  },
  useCellTypeExpressionBins: {
    useHook: (p: Params) => useCellTypeExpressionBins(narrow<Parameters<typeof useCellTypeExpressionBins>[0]>(p)),
    defaultParams: { geneList: 'CD4', datasetName: 'HBM279.TQRS.775' },
  },
  useCLIDToLabel: {
    useHook: (p: Params) => useCLIDToLabel(narrow<Parameters<typeof useCLIDToLabel>[0]>(p)),
    defaultParams: { clid: 'CL:0000084' },
  },
  useLabelToCLID: {
    useHook: (p: Params) => useLabelToCLID(narrow<Parameters<typeof useLabelToCLID>[0]>(p)),
    defaultParams: { cellType: 'Kidney.T cell' },
  },
  useEvaluateMarkers: {
    useHook: (p: Params) => useEvaluateMarkers(narrow<Parameters<typeof useEvaluateMarkers>[0]>(p)),
    defaultParams: { geneList: ['CD4'], cellTypes: ['Kidney.T cell'] },
  },
  useFindCellTypeSpecificities: {
    useHook: (p: Params) => useFindCellTypeSpecificities(narrow<Parameters<typeof useFindCellTypeSpecificities>[0]>(p)),
    defaultParams: { geneList: ['CD4'] },
  },
  useFindDatasetForCellTypes: {
    useHook: (p: Params) => useFindDatasetForCellTypes(narrow<Parameters<typeof useFindDatasetForCellTypes>[0]>(p)),
    defaultParams: { cellTypes: ['Kidney.T cell'] },
  },
  useFindDatasetForGenes: {
    useHook: (p: Params) => useFindDatasetForGenes(narrow<Parameters<typeof useFindDatasetForGenes>[0]>(p)),
    defaultParams: { geneList: ['CD4', 'MMRN1', 'ABCA1', '5S_rRNA'] },
  },
  useFindGeneSignatures: {
    useHook: (p: Params) => useFindGeneSignatures(narrow<Parameters<typeof useFindGeneSignatures>[0]>(p)),
    defaultParams: { cellTypes: 'Kidney.T cell' },
  },
  useFindHouseKeepingGenes: {
    useHook: (p: Params) => useFindHouseKeepingGenes(narrow<Parameters<typeof useFindHouseKeepingGenes>[0]>(p)),
    defaultParams: { cellTypes: 'Kidney.T cell' },
  },
  useFindSimilarGenes: {
    useHook: (p: Params) => useFindSimilarGenes(narrow<Parameters<typeof useFindSimilarGenes>[0]>(p)),
    defaultParams: { geneList: 'CD4', datasetName: 'HBM279.TQRS.775' },
  },
  useFindTissueSpecificities: {
    useHook: (p: Params) => useFindTissueSpecificities(narrow<Parameters<typeof useFindTissueSpecificities>[0]>(p)),
    defaultParams: { geneList: ['CD4'] },
  },
  useHyperQueryCellTypes: {
    useHook: (p: Params) => useHyperQueryCellTypes(narrow<Parameters<typeof useHyperQueryCellTypes>[0]>(p)),
    defaultParams: { geneList: ['CD4'] },
  },
} as const;

type HookName = keyof typeof hooks;

interface ExplorerProps {
  hook: HookName;
  /** Leave empty to use the hook's sample params. */
  params: Params;
}

function ScFindExplorer({ hook, params }: ExplorerProps) {
  const { useHook, defaultParams } = hooks[hook];
  const resolvedParams = Object.keys(params).length > 0 ? params : defaultParams;
  // Which hook runs is fixed for the lifetime of this component: the story below remounts it
  // (via `key`) whenever the control changes, so the hook order never varies within a mount.
  const result = useHook(resolvedParams);
  return <StoryControlTemplate title={hook} params={resolvedParams} result={result} />;
}

const meta = {
  title: 'SCFind/Explorer',
  component: ScFindExplorer,
  parameters: {
    docs: {
      description: {
        component: [
          'Calls one scFind hook and dumps its params and result.',
          '',
          'This talks to the **live dev API** through the Flask BFF, so it needs the Vite dev',
          'server running on port 5001 alongside Storybook (`pnpm dev-server`); the preview',
          'proxies `/scfind/*` there. Nothing here runs in CI — request shapes and response',
          'transforms are covered by `hooks.spec.tsx` instead.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    hook: {
      control: 'select',
      options: Object.keys(hooks),
    },
    params: {
      control: 'object',
    },
  },
  render: (args) => <ScFindExplorer key={args.hook} {...args} />,
} satisfies Meta<typeof ScFindExplorer>;

export default meta;

export const Explorer: StoryObj<typeof meta> = {
  args: {
    hook: 'useCellTypeNames',
    params: {},
  },
};
