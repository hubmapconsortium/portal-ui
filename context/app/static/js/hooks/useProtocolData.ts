import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { SWRError } from 'js/helpers/swr/errors';

interface FormattedProtocolUrls {
  protocols: string[];
  gitHub: string[];
}

export function isGithubUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  try {
    const parsedUrl = new URL(lowerUrl);
    return parsedUrl.hostname.endsWith('github.com');
  } catch {
    return false;
  }
}

/**
 * Protocol URLs formatter
 * There are currently inconsistencies in how protocol URLs are stored in the metadata.
 * Sometimes there are multiple URLs in a single string, sometimes they have `http://` or `https://` prefixes,
 * sometimes they have `dx.doi.org/` prefixes, and sometimes they have version suffixes like `/v1`.
 * This function standardizes the URLs into a format that can be used to fetch protocol data from the Protocols.io API.
 *
 * Occasionally (e.g. for Object x Analyte datasets), there may be a GitHub link instead of a Protocols.io link.
 *
 * @param protocolUrls the protocol URL(s) string from the entity metadata
 * @param lastVersion the last version number to request from the Protocols.io API
 * @returns {
 *  protocols: string[] - array of formatted protocol URLs for API requests
 *  gitHub: string[] - array of GitHub links found in the input URLs
 * }
 */
export function useFormattedProtocolUrls(protocolUrls: string, lastVersion: number): FormattedProtocolUrls {
  return useMemo(() => {
    const links: FormattedProtocolUrls = { gitHub: [], protocols: [] };
    if (protocolUrls.length === 0) {
      return links;
    }
    // Handle case with multiple URLs provided in one string and remove leading/trailing whitespace
    // If only one string is provided, it will be returned as an array
    // "dx.doi.org/10.17504/protocols.io.5qpvob93dl4o/v1, dx.doi.org/10.17504/protocols.io.dm6gpb7p5lzp/v1" ->
    // ["dx.doi.org/10.17504/protocols.io.5qpvob93dl4o/v1", "dx.doi.org/10.17504/protocols.io.dm6gpb7p5lzp/v1"]
    const splitLinks = protocolUrls
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    splitLinks.forEach((url) => {
      // Check if this is a GitHub URL
      if (isGithubUrl(url)) {
        links.gitHub.push(url);
      } else {
        // Process as a protocol.io URL
        // Strip `http://` and `https://` from the beginning of the URL if it exists
        // https://dx.doi.org/10.17504/protocols.io.btnfnmbn -> dx.doi.org/10.17504/protocols.io.btnfnmbn
        let processedUrl = url.replace(/^(?:https?:\/\/)?/i, '');
        // Strip `dx.doi.org/` from the beginning of the URL if it exists
        // dx.doi.org/10.17504/protocols.io.btnfnmbn -> 10.17504/protocols.io.btnfnmbn
        processedUrl = processedUrl.replace(/^dx\.doi\.org\//i, '');
        // Strip version number from end of the URL if it exists
        // 10.17504/protocols.io.btnfnmbn/v1 -> 10.17504/protocols.io.btnfnmbn
        processedUrl = processedUrl.replace(/\/v\d+$/, '');
        // Format into the API call URL
        // 10.17504/protocols.io.btnfnmbn -> https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1
        links.protocols.push(`https://www.protocols.io/api/v4/protocols/${processedUrl}?last_version=${lastVersion}`);
      }
    });

    return links;
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
