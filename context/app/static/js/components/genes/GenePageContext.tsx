import React, { PropsWithChildren, useMemo, useContext as useOptionalContext } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useGeneDetailData, { GeneDetailData } from 'js/api/scfind/useGeneDetailData';

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
 * Cell-types-section slice of the gene-detail aggregate: the all-organs hyperQuery signatures, the
 * organ list derived from them, and the label->CLID subset for those cell types.
 */
export const useGeneCellTypesData = () => {
  const { scFindData, scFindLoading } = useGenePageContext();
  return {
    hyperQuery: scFindData?.hyper_query ?? [],
    organs: scFindData?.organs ?? [],
    labelToClid: scFindData?.label_to_clid ?? {},
    isLoading: scFindLoading,
  };
};

/** Datasets slice of the gene-detail aggregate ({counts, findDatasets} from findDatasets). */
export const useGeneDatasetsData = () => {
  const { scFindData, scFindLoading } = useGenePageContext();
  return { data: scFindData?.find_datasets, isLoading: scFindLoading };
};
