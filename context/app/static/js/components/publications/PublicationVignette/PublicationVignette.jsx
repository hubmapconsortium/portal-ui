import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { useAppContext } from 'js/components/Contexts';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import useStickyToggle from 'js/hooks/useStickyToggle';

import { fillUrls } from './utils';

async function fetchVitessceConf({ assetsEndpoint, uuid, filePath, groupsToken, vignetteDirName, signal }) {
  const urlHandler = (url, isZarr) => {
    return `${url.replace('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)}${isZarr ? '' : `?token=${groupsToken}`}`;
  };

  const requestInitHandler = () => {
    return {
      headers: { Authorization: `Bearer ${groupsToken}` },
    };
  };
  const response = await fetch(
    `${assetsEndpoint}/${uuid}/vignettes/${vignetteDirName}/${filePath}?token=${groupsToken}`,
    {
      signal,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    console.error('Assets API failed', response);
    return undefined;
  }
  const conf = await response.json();
  return fillUrls(conf, urlHandler, requestInitHandler);
}

function useVitessceConfs(assetsEndpoint, groupsToken, uuid, vignette, vignetteDirName) {
  const [vitessceConfs, setVitessceConfs] = useState(undefined);

  useEffect(() => {
    const abortController = new AbortController();
    async function getAndSetVitessceConf() {
      const figuresConfs = await Promise.all(
        vignette.figures.map((figure) => {
          return fetchVitessceConf({
            assetsEndpoint,
            uuid,
            filePath: figure.file,
            groupsToken,
            vignetteDirName,
            signal: abortController.signal,
          });
        }),
      );
      setVitessceConfs(figuresConfs);
    }
    // Only fetch the vitessce confs if they haven't been fetched yet
    if (!vitessceConfs) {
      getAndSetVitessceConf();
      return () => {
        abortController.abort();
      };
    }
    return () => {};
  }, [assetsEndpoint, groupsToken, uuid, vignette.figures, vignetteDirName, vitessceConfs]);

  return vitessceConfs;
}

function PublicationVignette({ vignette, vignetteDirName, uuid, mounted }) {
  const { assetsEndpoint, groupsToken } = useAppContext();

  const vitessceConfs = useVitessceConfs(assetsEndpoint, groupsToken, uuid, vignette, vignetteDirName);

  // Workaround to make the visualization render only after the accordion section has been expanded while
  // still letting the prerequisites for the visualizations prefetch
  const hasBeenMounted = useStickyToggle(mounted);

  if (vitessceConfs) {
    return (
      <>
        <ReactMarkdown>{vignette.description}</ReactMarkdown>
        <VisualizationWrapper
          vitData={vitessceConfs.length === 1 ? vitessceConfs[0] : vitessceConfs}
          uuid={uuid}
          hasNotebook={false}
          shouldDisplayHeader={false}
          hasBeenMounted={hasBeenMounted}
          isPublicationPage
        />
      </>
    );
  }

  return null;
}

export default PublicationVignette;
