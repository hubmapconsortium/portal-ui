import useSWR from 'swr';
import { useAppContext } from 'js/components/Contexts';
import { multiFetcher } from 'js/helpers/multiFetcher';
import { fillUrls } from './utils';
import { PublicationVignette } from '../types';

type PublicationVignetteConfsInput = {
  uuid: string;
  vignette: PublicationVignette;
  vignetteDirName: string;
};

export function usePublicationVignetteConfs({ uuid, vignetteDirName, vignette }: PublicationVignetteConfsInput) {
  const { assetsEndpoint, groupsToken } = useAppContext();
  // Extract file paths from the vignette object to form the urls to fetch for this vignette
  const urls = vignette.figures?.map(
    ({ file }) => `${assetsEndpoint}/${uuid}/vignettes/${vignetteDirName}/${file}?token=${groupsToken}`,
  );
  const { data } = useSWR(urls, multiFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (data) {
    const urlHandler = (url: string, isZarr: boolean) => {
      return `${url.replace('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)}${
        isZarr || !groupsToken ? '' : `?token=${groupsToken}`
      }`;
    };

    const requestInitHandler = () => {
      // Only include the Authorization header if the user is logged in/has a groups token
      if (groupsToken) {
        return {
          headers: { Authorization: `Bearer ${groupsToken}` },
        };
      }
      return {};
    };
    // Formats the vitessce config data to replace the {{ base_url }} placeholder with the actual url.
    // TODO: Improve this `unknown`; I couldn't figure out how to import the appropriate `VitessceConfig` type from Vitessce.
    const formattedData: unknown[] = data.map((d) => fillUrls(d, urlHandler, requestInitHandler));
    return formattedData;
  }
  return undefined;
}
