import { useAppContext } from 'js/components/Contexts';
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
}

export async function fetchSoftAssay({ url, dataset, groupsToken }: SoftAssayRequest) {
  const response = (await fetch(`${url}/${dataset}`, {
    headers: {
      Authorization: `Bearer ${groupsToken}`,
    },
  }).then((res) => res.json())) as SoftAssayResponse;
  return response;
}

export function useSoftAssay(datasetId: string) {
  const { groupsToken, softAssayEndpoint } = useAppContext();
  return useSWR<SoftAssayResponse, unknown, string>(datasetId, (id) =>
    fetchSoftAssay({ url: `${softAssayEndpoint}/groupsToken`, dataset: id, groupsToken }),
  );
}
