import { useState, useEffect } from 'react';
import { decodeURLParamsToConf } from 'vitessce';

import { useSnackbarStore } from 'js/shared-styles/snackbars';

export function useVitessceConfig({ vitData, setVitessceState }) {
  const [vitessceSelection, setVitessceSelection] = useState(null);
  const [vitessceConfig, setVitessceConfig] = useState(null);

  const { toastError } = useSnackbarStore((store) => ({
    toastError: store.toastError,
  }));

  useEffect(() => {
    function setVitessceDefaults(vData) {
      setVitessceState(Array.isArray(vData) ? vData[0] : vData);
      setVitessceSelection(0);
      setVitessceConfig(vData);
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
        toastError('View configuration from URL was not able to be parsed.');
        setVitessceDefaults(vitData);
        return;
      }
      let initializedVitDataFromUrl = vitData;
      let initialSelectionFromUrl;
      // If these is a url conf and the we have a multidataset, use the url conf to find the initial selection of the multi-dataset.
      if (Array.isArray(vitData)) {
        initialSelectionFromUrl = Math.max(0, vitData.map(({ name }) => name).indexOf(vitessceURLConf?.name));
        initializedVitDataFromUrl[initialSelectionFromUrl] = vitessceURLConf || vitData[initialSelectionFromUrl];
      } else {
        initializedVitDataFromUrl = vitessceURLConf || vitData;
      }
      setVitessceState(initializedVitDataFromUrl[initialSelectionFromUrl]);
      setVitessceSelection(initialSelectionFromUrl);
      setVitessceConfig(initializedVitDataFromUrl);
    }
  }, [setVitessceState, vitData, toastError]);
  return { vitessceConfig, vitessceSelection, setVitessceSelection };
}
