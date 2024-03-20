import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { SWRError } from 'js/helpers/swr/errors';

export function useFormattedProtocolUrls(protocolUrls: string, lastVersion: number) {
  return useMemo(() => {
    if (protocolUrls.length === 0) {
      return [];
    }
    // Handle case with multiple URLs provided in one string and remove leading/trailing whitespace
    // If only one string is provided, it will be returned as an array
    // "dx.doi.org/10.17504/protocols.io.5qpvob93dl4o/v1, dx.doi.org/10.17504/protocols.io.dm6gpb7p5lzp/v1" ->
    // ["dx.doi.org/10.17504/protocols.io.5qpvob93dl4o/v1", "dx.doi.org/10.17504/protocols.io.dm6gpb7p5lzp/v1"]
    const protocols = protocolUrls.split(',').map((url) => url.trim());
    // Strip `http://` and `https://` from the beginning of the URL if it exists
    // https://dx.doi.org/10.17504/protocols.io.btnfnmbn -> dx.doi.org/10.17504/protocols.io.btnfnmbn
    const noHttpPrefix = protocols.map((url) => url.replace(/^(?:https?:\/\/)?/i, ''));
    // Strip `dx.doi.org/` from the beginning of the URL if it exists
    // dx.doi.org/10.17504/protocols.io.btnfnmbn -> 10.17504/protocols.io.btnfnmbn
    const noDomainPrefix = noHttpPrefix.map((url) => url.replace(/^dx\.doi\.org\//i, ''));
    // Strip version number from end of the URL if it exists
    // 10.17504/protocols.io.btnfnmbn/v1 -> 10.17504/protocols.io.btnfnmbn
    const noVersionSuffix = noDomainPrefix.map((url) => url.replace(/\/v\d+$/, ''));
    // Format into the API call URL
    // 10.17504/protocols.io.btnfnmbn -> https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1
    const formattedUrls = noVersionSuffix.map(
      (doi) => `https://www.protocols.io/api/v4/protocols/${doi}?last_version=${lastVersion}`,
    );
    return formattedUrls;
  }, [protocolUrls, lastVersion]);
}

interface ProtocolData {
  payload: {
    title: string;
    url: string;
  };
}

function useProtocolData(protocolUrl: string) {
  const { protocolsClientToken } = useAppContext();
  const result = useSWR<ProtocolData, SWRError, [string, string]>(
    [protocolUrl, protocolsClientToken],
    ([url, token]: string[]) =>
      fetcher<ProtocolData>({ url, requestInit: { headers: { Authorization: `Bearer ${token}` } } }),
  );
  return result;
}

export default useProtocolData;
