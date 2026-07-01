import React, { PropsWithChildren, useMemo, useContext as useOptionalContext } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useGeneDetailData, { GeneDetailData } from 'js/api/scfind/useGeneDetailData';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';

interface GenePageContextProps {
  geneSymbol: string;
}
interface GenePageContext extends GenePageContextProps {
  geneSymbolUpper: string;
  // Aggregate scfind data for the page, fetched once here and read by child components via the
  // selector hooks below. Loading is non-blocking; children show skeletons while `scFindLoading`.
  scFindData?: GeneDetailData;
  scFindLoading: boolean;
  scFindError: unknown;
}

const GenePageContext = createContext<GenePageContext>('GenePageContext');

export default function GenePageProvider({ children, geneSymbol }: PropsWithChildren<GenePageContextProps>) {
  const { data: scFindData, isLoading: scFindLoading, error: scFindError } = useGeneDetailData(geneSymbol);
  const value = useMemo(
    () => ({
      geneSymbol,
      geneSymbolUpper: geneSymbol.toLocaleUpperCase(),
      scFindData,
      scFindLoading,
      scFindError,
    }),
    [geneSymbol, scFindData, scFindLoading, scFindError],
  );
  return <GenePageContext.Provider value={value}>{children}</GenePageContext.Provider>;
}

export const useGenePageContext = () => useContext(GenePageContext);
export const useOptionalGenePageContext = () => useOptionalContext(GenePageContext);

/**
 * Cell-types-section slice of the gene-detail aggregate, per modality (`'ATAC'` selects the ATAC
 * variant; `undefined` is RNA): the all-organs hyperQuery signatures, the organ list derived from
 * them, and the (modality-agnostic) label->CLID subset for those cell types.
 */
export const useGeneCellTypesData = (modality?: SCFindModality) => {
  const { scFindData, scFindLoading } = useGenePageContext();
  const isAtac = modality === 'ATAC';
  return {
    hyperQuery: (isAtac ? scFindData?.hyper_query_atac : scFindData?.hyper_query) ?? [],
    organs: (isAtac ? scFindData?.organs_atac : scFindData?.organs) ?? [],
    labelToClid: scFindData?.label_to_clid ?? {},
    isLoading: scFindLoading,
  };
};

/**
 * Datasets slice of the gene-detail aggregate ({counts, findDatasets} from findDatasets), per
 * modality (`'ATAC'` selects the ATAC variant; `undefined` is RNA).
 */
export const useGeneDatasetsData = (modality?: SCFindModality) => {
  const { scFindData, scFindLoading } = useGenePageContext();
  const isAtac = modality === 'ATAC';
  return {
    data: isAtac ? scFindData?.find_datasets_atac : scFindData?.find_datasets,
    isLoading: scFindLoading,
  };
};
