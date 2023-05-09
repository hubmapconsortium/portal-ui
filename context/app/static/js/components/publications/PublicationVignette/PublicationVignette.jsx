import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { AppContext } from 'js/components/Providers';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';

import { fillUrls } from './utils';

async function fetchVitessceConf({ assetsEndpoint, uuid, filePath, groupsToken, vignetteDirName }) {
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

function PublicationVignette({ vignette, vignetteDirName, uuid }) {
  const { assetsEndpoint, groupsToken } = useContext(AppContext);

  const [vitessceConfs, setVitessceConfs] = useState(undefined);

  useEffect(() => {
    async function getAndSetVitessceConf() {
      const figuresConfs = await Promise.all(
        vignette.figures.map((figure) => {
          return fetchVitessceConf({ assetsEndpoint, uuid, filePath: figure.file, groupsToken, vignetteDirName });
        }),
      );
      setVitessceConfs(figuresConfs);
    }
    getAndSetVitessceConf();
  }, [assetsEndpoint, groupsToken, uuid, vignette.figures, vignetteDirName]);

  if (vitessceConfs) {
    return (
      <>
        <ReactMarkdown>{vignette.description}</ReactMarkdown>
        <VisualizationWrapper
          vitData={vitessceConfs.length === 1 ? vitessceConfs[0] : vitessceConfs}
          uuid={uuid}
          hasNotebook={false}
          shouldDisplayHeader={false}
        />
      </>
    );
  }

  return null;
}

export default PublicationVignette;
