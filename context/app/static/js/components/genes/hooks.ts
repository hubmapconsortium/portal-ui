import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr';

import { useOrgansDatasetCounts } from 'js/pages/Organs/hooks';

import { useGeneOntologyDetail } from 'js/hooks/useUBKG';
import { SWRError } from 'js/helpers/swr/errors';
import { useOrgansAPI } from 'js/hooks/useOrgansApi';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import { useGenePageContext } from './GenePageContext';

import { OrganFile, OrganFileWithDescendants } from '../organ/types';

// TODO: Convert js/pages/Organs/hooks to TS
const useTypedOrgansDatasetCounts = (organs: Record<string, OrganFile>) => {
  return useOrgansDatasetCounts(organs) as {
    organsWithDatasetCounts: Record<string, OrganFileWithDescendants>;
    isLoading: boolean;
  };
};

const useGeneDetails = () => {
  const { geneSymbol } = useGenePageContext();
  const crossModality = useFeatureDetails('genes', geneSymbol);
  const ontology = useGeneOntologyDetail(geneSymbol);
  return {
    ...ontology,
    crossModality,
  };
};

const useGeneOrgans = () => {
  const { data: geneData } = useGeneDetails();
  const organsToFetch = useMemo(() => {
    return (
      geneData?.cell_types
        .flatMap((cellType) => cellType.organs)
        .filter((o) => o.id)
        .map(({ name }) => name) ?? []
    );
  }, [geneData]);

  const { data, ...organs } = useSWR<Record<string, OrganFile>, SWRError, [url: string, organList: string[]]>(
    [useOrgansAPI().organList, organsToFetch],
    ([url, organList]) =>
      fetcher<Record<string, OrganFile>>({
        url,
        requestInit: {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ organs: organList }),
        },
      }),
  );

  const organsWithAzimuth = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(
      Object.entries(data).filter(([_organName, organ]) => {
        return organ?.azimuth;
      }),
    );
  }, [data]);

  const { organsWithDatasetCounts, isLoading: isLoadingDatasetCounts } = useTypedOrgansDatasetCounts(organsWithAzimuth);

  return {
    ...organs,
    data: organsWithDatasetCounts,
    isLoadingDatasetCounts,
  };
};

export { useGeneDetails, useGenePageContext, useGeneOrgans };
