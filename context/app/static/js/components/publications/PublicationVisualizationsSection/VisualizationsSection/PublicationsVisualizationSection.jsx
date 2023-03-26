import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from 'js/components/Providers';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import { fillUrls } from './utils';

async function fetchVitessceConf(assetsEndpoint, uuid, p, groupsToken) {
  const response = await fetch(`${assetsEndpoint}/${uuid}/vignettes/vignette_01/${p}?token=${groupsToken}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Assets API failed', response);
    return undefined;
  }
  const results = await response.json();
  return results;
}

function PublicationsVisualizationSection({ vignette_data, uuid }) {
  const { assetsEndpoint, groupsToken } = useContext(AppContext);
  const p = vignette_data.vignette_01.figures[0].file;

  const [v, setV] = useState(undefined);

  useEffect(() => {
    async function getAndSetVitessceConf() {
      const results = await fetchVitessceConf(assetsEndpoint, uuid, p, groupsToken);
      const urlHandler = (url) => {
        return `${url.replace('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)}?token=${groupsToken}`;
      };
      setV(fillUrls(results, urlHandler));
      // setV(JSON.parse(JSON.stringify(results).replaceAll('{{ base_url }}', `${assetsEndpoint}/${uuid}/data`)));
    }
    getAndSetVitessceConf();
  }, [assetsEndpoint, groupsToken, p, uuid]);

  return v ? <VisualizationWrapper vitData={v} uuid={uuid} hasNotebook={false} /> : null;
}

export default PublicationsVisualizationSection;
