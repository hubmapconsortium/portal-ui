import { useState, useEffect } from 'react';
import { decodeURLParamsToConf } from 'vitessce';

export function useVitessceConfig({ vitData, setVitessceState, setVitessceErrors }) {
  const [vitessceSelection, setVitessceSelection] = useState(null);
  const [vitessceConfig, setVitessceConfig] = useState(null);

  useEffect(() => {
    if (setVitessceState && vitData) {
      const fragment = window.location.hash.substr(1);
      let vitessceURLConf;
      const isMultiDataset = Array.isArray(vitData);
      try {
        vitessceURLConf = fragment.length > 0 ? decodeURLParamsToConf(fragment) : null;
      } catch (err) {
        // If URL cannot be parsed, display error and show Vitessce.
        setVitessceErrors(['URL was not able to parsed because it was likely truncated.']);
        setVitessceState(isMultiDataset ? vitData[0] : vitData);
        setVitessceSelection(0);
        setVitessceConfig(vitData);
        return;
      }
      let initializedVitDataFromUrl = vitData;
      let initialSelectionFromUrl;
      // If these is a url conf and the we have a multidataset, use the url conf to find the initial selection of the multi-dataset.
      if (isMultiDataset) {
        initialSelectionFromUrl = Math.max(0, vitData.map(({ name }) => name).indexOf(vitessceURLConf?.name));
        initializedVitDataFromUrl[initialSelectionFromUrl] = vitessceURLConf || vitData[initialSelectionFromUrl];
      } else {
        initializedVitDataFromUrl = vitessceURLConf || vitData;
      }
      setVitessceState(initializedVitDataFromUrl[initialSelectionFromUrl]);
      setVitessceSelection(initialSelectionFromUrl);
      setVitessceConfig(initializedVitDataFromUrl);
    }
  }, [setVitessceState, vitData, setVitessceErrors]);
  return { vitessceConfig, vitessceSelection, setVitessceSelection };
}
