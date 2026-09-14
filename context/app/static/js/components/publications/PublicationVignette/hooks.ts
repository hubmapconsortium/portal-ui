import useSWR from 'swr';
import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import { multiFetcher } from 'js/helpers/swr';
import { VitessceConfig } from 'vitessce';
import { fillUrls } from './utils';
import { PublicationVignette } from '../types';

interface PublicationVignetteConfsInput {
  uuid: string;
  vignette: PublicationVignette;
  vignetteDirName: string;
}

export function usePublicationVignetteConfs({ uuid, vignetteDirName, vignette }: PublicationVignetteConfsInput) {
  const { assetsEndpoint, groupsToken } = useAppContext();
  const { entity } = useFlaskDataContext();
  // Vignette assets live under the publication's own uuid, so the publication's access level decides
  // whether the assets API needs a token at all. Embedding one for public data would put an expiring
  // credential into every exported config for no benefit. Anything short of a positive `Public` —
  // including the field being absent — keeps the previous behavior.
  const assetsArePublic = entity?.mapped_data_access_level === 'Public';
  const confToken = assetsArePublic ? '' : groupsToken;

  // Extract file paths from the vignette object to form the urls to fetch for this vignette.
  // This is a request-time credential that never enters a config, so it always uses the real token.
  const urls = vignette.figures?.map(
    ({ file }) => `${assetsEndpoint}/${uuid}/vignettes/${vignetteDirName}/${file}?token=${groupsToken}`,
  );
  const { data } = useSWR(urls, (u) => multiFetcher({ urls: u }));

  if (data) {
    const urlHandler = (url: string, isZarr: boolean) => {
      return `${url.replace('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)}${
        isZarr || !confToken ? '' : `?token=${confToken}`
      }`;
    };

    const requestInitHandler = () => {
      // Only include the Authorization header if the assets actually need authenticating
      if (confToken) {
        return {
          headers: { Authorization: `Bearer ${confToken}` },
        };
      }
      return {};
    };
    // Formats the vitessce config data to replace the {{ base_url }} placeholder with the actual url.
    const formattedData: VitessceConfig[] = data.map((d) =>
      fillUrls(d as VitessceConfig, urlHandler, requestInitHandler),
    );
    return formattedData;
  }
  return undefined;
}
