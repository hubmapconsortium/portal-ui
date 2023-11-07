import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr';
import { useGenePageContext } from './GenePageContext';
import { useAppContext } from '../Contexts';

import { GeneDetail, GeneListResponse, OrganInfo } from './types';

const useGeneApiURLs = () => {
  const { ubkgEndpoint } = useAppContext();
  return useMemo(
    () => ({
      detailURL(geneId: string) {
        // return `${ubkgEndpoint}/genes/${geneId.toUpperCase()}`;
        return `${ubkgEndpoint}/gene/${geneId.toUpperCase()}`;
      },
      get list() {
        // return `${ubkgEndpoint}/genes-info`;
        return `${ubkgEndpoint}/genes`;
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
  const { data, ...swr } = useSWR<GeneDetailResponse>(useGeneApiURLs().detailURL(geneSymbol), (url: string) =>
    fetcher({ url }),
  );
  return { data: data?.[0], ...swr };
};

const useGeneOrgans = () => {
  const { data } = useGeneDetails();
  const organsToFetch = useMemo(() => {
    return (
      data?.cell_types
        .flatMap((cellType) => cellType.organs)
        .filter((o) => o.id)
        .map(({ name }) => name) ?? []
    );
  }, [data]);
  const organs = useSWR([useGeneApiURLs().organList, organsToFetch], ([url, organList]) =>
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
  console.log(organs);

  return organs;
};

const starts_with = undefined;

const useGeneList = (page: number) => {
  const query = useMemo(
    () => ({
      page,
      genesperpage,
      starts_with,
    }),
    [page],
  );
  return useSWR<GeneListResponse>([useGeneApiURLs().list, query], ([url, body]: [string, object]) =>
    fetcher({ url, requestInit: { body: JSON.stringify(body) } }),
  );
};

// Re-export `useGenePageContext` for convenience
export { useGeneDetails, useGeneList, useGenePageContext, useGeneOrgans };
