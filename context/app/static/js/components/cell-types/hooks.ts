import { useMemo, useState } from 'react';

import useSWR from 'swr';
import { useEventCallback } from '@mui/material/utils';
import { SelectChangeEvent } from '@mui/material/Select';

import { fetcher } from 'js/helpers/swr';

import { useCellTypesContext } from './CellTypesContext';
import { useAppContext } from '../Contexts';

export const useCellTypeDatasets = () => {
  const { cellId } = useCellTypesContext();
  const swr = useSWR<string[]>(`/cell-types/${cellId}/datasets.json`, (url: string) => fetcher({ url }));
  return swr;
};

interface CellTypeSample {
  hubmap_id: string;
  last_modified_timestamp: number;
  organ: string[];
  sample_category: string;
  uuid: string;
}

type CellTypeSamples = CellTypeSample[];

export const useCellTypeSamples = () => {
  const { cellId } = useCellTypesContext();
  const swr = useSWR<CellTypeSamples>(`/cell-types/${cellId}/samples.json`, (url: string) => fetcher({ url }));
  return swr;
};

export interface CellTypeOrgan {
  celltype_cells: number;
  organ: string;
  total_cells: number;
  other_cells: number;
}

type CellTypeOrgans = CellTypeOrgan[];

export const useCellTypeOrgans = () => {
  const { cellId } = useCellTypesContext();
  const swr = useSWR<CellTypeOrgans>(`/cell-types/${cellId}/organs.json`, (url: string) => fetcher({ url }));
  return swr;
};

export interface CellTypeBiomarkerInfo {
  biomarker_type: string;
  entry: {
    id: string;
    name: string;
    symbol: string;
    vocabulary: string;
  };
  reference: string;
}

interface CellTypeInfoResponse {
  biomarkers: CellTypeBiomarkerInfo[];
  cell_type: {
    cl_id: string;
    definition: string;
    name: string;
  };
  organs: {
    id: string;
    name: string;
    source: string;
  };
}

export const useCellTypeInfo = () => {
  const { cellId } = useCellTypesContext();
  const { ubkgEndpoint } = useAppContext();
  const cellIdWithoutPrefix = cellId.replace('CL:', '');
  const { data, ...swr } = useSWR<[CellTypeInfoResponse]>(
    `${ubkgEndpoint}/celltypes/${cellIdWithoutPrefix}`,
    (url: string) => fetcher({ url }),
  );
  return { ...swr, data: data?.[0] };
};

export const useCellTypeName = () => {
  const { data } = useCellTypeInfo();
  return data?.cell_type.name;
};

export const useCellTypeBiomarkers = () => {
  const { data } = useCellTypeInfo();

  const sources = useMemo(() => {
    const biomarkers = data?.biomarkers ?? [];
    return biomarkers
      .map((biomarker) => biomarker.reference)
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [data?.biomarkers]);
  const [selectedSource, setSelectedSource] = useState(sources[0] ?? '');
  if (!selectedSource && sources.length > 0) {
    setSelectedSource(sources[0]);
  }

  const [genes, proteins] = useMemo(() => {
    const genesForSource: CellTypeBiomarkerInfo[] = [];
    const proteinsForSource: CellTypeBiomarkerInfo[] = [];
    data?.biomarkers
      .filter((biomarker) => biomarker.reference === selectedSource)
      .forEach((biomarker) => {
        if (biomarker.biomarker_type === 'gene') {
          genesForSource.push(biomarker);
        } else {
          proteinsForSource.push(biomarker);
        }
      });
    return [genesForSource, proteinsForSource];
  }, [data?.biomarkers, selectedSource]);

  const handleSourceSelection = useEventCallback((event: SelectChangeEvent<string>) => {
    setSelectedSource(event.target.value);
  });

  return { genes, proteins, sources, selectedSource, handleSourceSelection };
};
