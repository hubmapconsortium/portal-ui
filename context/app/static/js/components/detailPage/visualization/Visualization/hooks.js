import { useState, useEffect } from 'react';
import { decodeURLParamsToConf, VitessceConfig, CoordinationType as ct } from 'vitessce';

import { useSnackbarStore } from 'js/shared-styles/snackbars';

function handleMarkerGene(vData, markerGene) {
  if (vData?.layout && markerGene) {
    const vc = VitessceConfig.fromJSON(vData);
    const [featureSelection, obsColorEncoding] = vc.addCoordination(ct.FEATURE_SELECTION, ct.OBS_COLOR_ENCODING);
    vc.config.layout.forEach((v) => v.useCoordination(featureSelection, obsColorEncoding));
    featureSelection.setValue([markerGene]);
    obsColorEncoding.setValue('geneSelection');
    return vc.toJSON();
  }
  return vData;
}

export function useVitessceConfig({ vitData, setVitessceState, markerGene }) {
  const [vitessceSelection, setVitessceSelection] = useState(null);
  const [vitessceConfig, setVitessceConfig] = useState(null);

  const { toastError } = useSnackbarStore((store) => ({
    toastError: store.toastError,
  }));

  useEffect(() => {
    function setVitessceDefaults(vData) {
      const vDataWithMarkerGene = Array.isArray(vData)
        ? vData.map((v) => handleMarkerGene(v, markerGene))
        : handleMarkerGene(vData, markerGene);
      setVitessceState(Array.isArray(vData) ? vDataWithMarkerGene[0] : vDataWithMarkerGene);
      setVitessceSelection(0);
      setVitessceConfig(vDataWithMarkerGene);
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
  }, [setVitessceState, vitData, toastError, markerGene]);
  return { vitessceConfig, vitessceSelection, setVitessceSelection };
}
