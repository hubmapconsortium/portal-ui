import { useState, useEffect } from 'react';
import { decodeURLParamsToConf } from 'vitessce';

export function useVitessceConfig({ vitData, setVitessceState }) {
  const [vitessceSelection, setVitessceSelection] = useState(null);
  const [vitessceConfig, setVitessceConfig] = useState(null);

  useEffect(() => {
    if (setVitessceState && vitData) {
      const fragment = window.location.hash.substr(1);
      const vitessceURLConf = fragment?.length > 0 ? decodeURLParamsToConf(fragment) : null;
      const isMultiDataset = Array.isArray(vitData);
      // If these is a url conf and the we have a multidataset, use the url conf to find the initial selection of the multi-dataset.
      const initialSelectionFromUrl =
        isMultiDataset && Math.max(0, vitData.map(({ name }) => name).indexOf(vitessceURLConf?.name));
      let initializedVitDataFromUrl = vitData;
      // Set the initialized  view config to be either the url configuration or the default that came from the server.
      if (isMultiDataset) {
        initializedVitDataFromUrl[initialSelectionFromUrl] = vitessceURLConf || vitData[initialSelectionFromUrl];
      } else {
        initializedVitDataFromUrl = vitessceURLConf || vitData;
      }
      setVitessceState(initializedVitDataFromUrl[initialSelectionFromUrl]);
      setVitessceSelection(initialSelectionFromUrl);
      setVitessceConfig(initializedVitDataFromUrl);
    }
  }, [setVitessceState, vitData]);
  return { vitessceConfig, vitessceSelection, setVitessceSelection };
}
