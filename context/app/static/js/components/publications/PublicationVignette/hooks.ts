import useSWR from 'swr';
import { useAppContext } from 'js/components/Contexts';
import { fillUrls } from './utils';
import { PublicationVignette } from '../types';

const multiFetcher = (...urls: string[]) => {
  const f = (url: string) => fetch(url).then((r) => r.json());
  return Promise.all(urls.map((url) => f(url)));
};

type PublicationVignetteConfsInput = {
  uuid: string;
  vignette: PublicationVignette;
  vignetteDirName: string;
};

export function usePublicationVignetteConfs({ uuid, vignetteDirName, vignette }: PublicationVignetteConfsInput) {
  const { assetsEndpoint, groupsToken } = useAppContext();
  const urls = vignette.figures.map(
    ({ file }) => `${assetsEndpoint}/${uuid}/vignettes/${vignetteDirName}/${file}?token=${groupsToken}`,
  );
  const urlHandler = (url: string, isZarr: boolean) => {
    return `${url.replace('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)}${isZarr ? '' : `?token=${groupsToken}`}`;
  };

  const requestInitHandler = () => {
    return {
      headers: { Authorization: `Bearer ${groupsToken}` },
    };
  };
  const { data } = useSWR(urls, multiFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (data) {
    // Formats the vitessce config data to replace the {{ base_url }} placeholder with the actual url.
    // TODO: Fix this any; I couldn't figure out how to import the appropriate type from Vitessce.
    const formattedData: any[] = data.map(d => fillUrls(d, urlHandler, requestInitHandler));
    return formattedData;
  }
  return undefined;
}
