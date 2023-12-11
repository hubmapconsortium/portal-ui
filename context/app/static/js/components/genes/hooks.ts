import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr';
import { useOrgansDatasetCounts } from 'js/pages/Organs/hooks';
import { SWRError } from 'js/helpers/swr/errors';
import useSWRInfinite from 'swr/infinite';
import { useGenePageContext } from './GenePageContext';
import { useAppContext } from '../Contexts';

import { GeneDetail, GeneListResponse } from './types';
import { OrganFile, OrganFileWithDescendants } from '../organ/types';

// TODO: Convert js/pages/Organs/hooks to TS
const useTypedOrgansDatasetCounts = (organs: Record<string, OrganFile>) => {
  return useOrgansDatasetCounts(organs) as {
    organsWithDatasetCounts: Record<string, OrganFileWithDescendants>;
    isLoading: boolean;
  };
};

const useGeneApiURLs = () => {
  const { ubkgEndpoint } = useAppContext();
  return useMemo(
    () => ({
      detailURL(geneId: string) {
        return `${ubkgEndpoint}/genes/${geneId.toUpperCase()}`;
      },
      get list() {
        return `${ubkgEndpoint}/genes-info`;
      },
      organDetails(organName: string) {
        return `/organ/${organName}.json`;
      },
      get organList() {
        return `/organs.json`;
      },
    }),
    [ubkgEndpoint],
  );
};

type GeneDetailResponse = [GeneDetail];

const useGeneDetails = () => {
  const { geneSymbol } = useGenePageContext();
  const { data, error, ...swr } = useSWR<GeneDetailResponse, SWRError>(
    useGeneApiURLs().detailURL(geneSymbol),
    (url: string) =>
      fetcher({
        url,
        errorMessages: {
          404: `The gene ${geneSymbol} was not found.`,
        },
      }),
  );
  // Throw an error if the gene is not found
  if (error) {
    throw error;
  }
  return { data: data?.[0], ...swr };
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

  const { data, ...organs } = useSWR<Record<string, OrganFile>, unknown, [url: string, organList: string[]]>(
    [useGeneApiURLs().organList, organsToFetch],
    ([url, organList]) =>
      fetcher({
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

const useGeneList = (starts_with: string) => {
  const apiUrls = useGeneApiURLs();
  const query = useMemo(
    () => ({
      genesperpage: '10',
      starts_with,
    }),
    [starts_with],
  );
  const getKey = (pageIndex: number, previousPageData: GeneListResponse | null) => {
    if (
      previousPageData &&
      previousPageData.pagination.page === previousPageData.pagination.total_pages &&
      starts_with === previousPageData.pagination.starts_with
    )
      return null;
    return `${apiUrls.list}?${new URLSearchParams({ ...query, page: String(pageIndex + 1) }).toString()}`;
  };
  return useSWRInfinite<GeneListResponse>(getKey, (url: string) => fetcher({ url }), {
    revalidateAll: false,
    revalidateFirstPage: false,
  });
};

// Re-export `useGenePageContext` for convenience
export { useGeneDetails, useGeneList, useGenePageContext, useGeneOrgans };
