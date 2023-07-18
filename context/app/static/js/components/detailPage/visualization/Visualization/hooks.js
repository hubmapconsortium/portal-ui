import { useState, useEffect } from 'react';
import { decodeURLParamsToConf } from 'vitessce';

const guaranteeUidForConfig = (vData) => {
  if (Array.isArray(vData)) {
    return vData.map((v, index) => {
      if (!v.uid) {
        return {
          ...v,
          uid: `vitessce-${v.name || index}`,
        };
      }
      return v;
    });
  }
  if (!vData.uid) {
    return {
      ...vData,
      uid: 'vitessce-0',
    };
  }
  return vData;
};

export function useVitessceConfig({ vitData, setVitessceState, setVitessceErrors }) {
  const [vitessceSelection, setVitessceSelection] = useState(0);
  const [vitessceConfig, setVitessceConfig] = useState(null);

  useEffect(() => {
    function setVitessceDefaults(vData) {
      setVitessceState(Array.isArray(vData) ? vData[0] : vData);
      setVitessceSelection(0);
      setVitessceConfig(guaranteeUidForConfig(vData));
    }

    if (setVitessceState && vitData) {
      const fragment = window.location.hash.substr(1);
      if (!fragment.startsWith('vitessce_conf_')) {
        // This is an anchor link like "#attribution", rather than a saved vitessce link.
        setVitessceDefaults(vitData);
        return;
      }
      let vitessceURLConf;
      try {
        vitessceURLConf = fragment.length > 0 ? decodeURLParamsToConf(fragment) : null;
      } catch (err) {
        // If URL cannot be parsed, display error and show Vitessce.
        setVitessceErrors(['View configuration from URL was not able to be parsed because it was likely truncated.']);
        setVitessceDefaults(vitData);
        return;
      }
      let initializedVitDataFromUrl = vitData;
      let initialSelectionFromUrl;
      // If these is a url conf and we have a multidataset, use the url conf to find the initial selection of the multi-dataset.
      if (Array.isArray(vitData)) {
        initialSelectionFromUrl = Math.max(0, vitData.map(({ name }) => name).indexOf(vitessceURLConf?.name));
        initializedVitDataFromUrl[initialSelectionFromUrl] = vitessceURLConf || vitData[initialSelectionFromUrl];
      } else {
        initializedVitDataFromUrl = vitessceURLConf || vitData;
      }
      setVitessceState(initializedVitDataFromUrl[initialSelectionFromUrl]);
      setVitessceSelection(initialSelectionFromUrl);
      setVitessceConfig(guaranteeUidForConfig(initializedVitDataFromUrl));
    }
  }, [setVitessceState, vitData, setVitessceErrors]);

  return { vitessceConfig, vitessceSelection, setVitessceSelection };
}
