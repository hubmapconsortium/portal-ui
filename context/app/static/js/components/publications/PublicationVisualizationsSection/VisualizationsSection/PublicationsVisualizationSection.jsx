import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from 'js/components/Providers';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import { fillUrls } from './utils';

async function fetchVitessceConf(assetsEndpoint, uuid, filePath, groupsToken) {
  const urlHandler = (url, isZarr) => {
    return `${url.replace('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)}${isZarr ? '' : `?token=${groupsToken}`}`;
  };

  const requestInitHandler = () => {
    return {
      headers: { Authorization: `Bearer ${groupsToken}` },
    };
  };
  const response = await fetch(`${assetsEndpoint}/${uuid}/vignettes/vignette_01/${filePath}?token=${groupsToken}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Assets API failed', response);
    return undefined;
  }
  const conf = await response.json();
  return fillUrls(conf, urlHandler, requestInitHandler);
}

function PublicationsVisualizationSection({ vignette_data, uuid }) {
  const { assetsEndpoint, groupsToken } = useContext(AppContext);
  const p = vignette_data.vignette_01.figures[0].file;

  const [vitessceConfs, setVitessceConfs] = useState(undefined);

  useEffect(() => {
    async function getAndSetVitessceConf() {
      const figuresConfs = await Promise.all(
        vignette_data.vignette_01.figures.map((figure) => {
          return fetchVitessceConf(assetsEndpoint, uuid, figure.file, groupsToken);
        }),
      );
      setVitessceConfs(figuresConfs);
    }
    getAndSetVitessceConf();
  }, [assetsEndpoint, groupsToken, p, uuid, vignette_data.vignette_01.figures]);

  return vitessceConfs ? <VisualizationWrapper vitData={vitessceConfs[0]} uuid={uuid} hasNotebook={false} /> : null;
}

export default PublicationsVisualizationSection;
