import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import useSWR from 'swr';

interface SoftAssayRequest {
  url: string;
  dataset: string;
  groupsToken: string;
}

interface SoftAssayResponse {
  assaytype: string;
  'contains-pii': boolean;
  description: string;
  'pipeline-shorthand': string;
  primary: boolean;
  'vitessce-hints': string[];
  process_state: string;
  'dataset-type': string;
}

export async function fetchSoftAssay({ url, dataset, groupsToken }: SoftAssayRequest) {
  return fetcher<SoftAssayResponse>({
    url: `${url}/${dataset}`,
    requestInit: {
      headers: {
        Authorization: `Bearer ${groupsToken}`,
      },
    },
  });
}

export function useSoftAssay(datasetId: string) {
  const { groupsToken, softAssayEndpoint } = useAppContext();
  return useSWR<SoftAssayResponse, unknown, string>(datasetId, (id) =>
    fetchSoftAssay({ url: `${softAssayEndpoint}/groupsToken`, dataset: id, groupsToken }),
  );
}
