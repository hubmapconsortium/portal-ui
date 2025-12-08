import { useState, useEffect, useMemo } from 'react';
import { decodeURLParamsToConf, VitessceConfig } from 'vitessce';

import { useSnackbarActions, useSnackbarStore } from 'js/shared-styles/snackbars';
import useVisualizationStore from 'js/stores/useVisualizationStore';

import { isFirefox } from 'react-device-detect';

interface UseVitessceConfigProps {
  vitData?: object | object[];
  setVitessceState: (v: object) => void;
  markerGene?: string;
}

// The `VitessceConfig.fromJSON` method clobbers the requestInit information for datasets, so this is temporarily disabled.
function formatVitessceConf(vData: object) {
  // if ('layout' in vData && vData.layout && 'name' in vData && vData.name !== 'Error') {
  //   const vc = VitessceConfig.fromJSON(vData);
  //   console.log({ vc, vData });
  //   return vc.toJSON();
  // }
  // console.error("Vitessce config missing 'layout' or 'name' field.");
  return vData;
}

export function useVitessceConfig({ vitData, setVitessceState, markerGene }: UseVitessceConfigProps) {
  const [vitessceSelection, setVitessceSelection] = useState<number>(0);
  const [vitessceConfig, setVitessceConfig] = useState<object | null>(null);

  const { toastError } = useSnackbarStore((store) => ({
    toastError: store.toastError,
  }));

  const isMultiDataset = Array.isArray(vitData);

  // Find parent UUID for the visualization if present
  const parentUuid: string | undefined = useMemo(() => {
    if (!vitData) {
      return undefined;
    }
    if (isMultiDataset) {
      const vitDataArray = vitData as VitessceConfig[];
      const found = vitDataArray.find((data) => 'parentUuid' in data) as { parentUuid: string } | undefined;
      return found?.parentUuid;
    }
    if ('parentUuid' in vitData) {
      return (vitData as { parentUuid: string }).parentUuid;
    }
    return undefined;
  }, [vitData, isMultiDataset]);

  useEffect(() => {
    function setVitessceDefaults(vData: object | object[]) {
      if (Array.isArray(vData)) {
        const processedVData: object[] = vData.map((v: object) => formatVitessceConf(v));
        setVitessceState(processedVData[0]);
        setVitessceConfig(processedVData);
      } else {
        const processedVData = formatVitessceConf(vData);
        setVitessceState(processedVData);
        setVitessceConfig(processedVData);
      }
      setVitessceSelection(0);
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
      } catch {
        // If URL cannot be parsed, display error and show Vitessce.
        toastError('View configuration from URL was not able to be parsed.');
        setVitessceDefaults(vitData);
        return;
      }
      let initializedVitDataFromUrl = vitData;
      let initialSelectionFromUrl;
      // If these is a url conf and the we have a multidataset, use the url conf to find the initial selection of the multi-dataset.
      if (Array.isArray(initializedVitDataFromUrl)) {
        initialSelectionFromUrl = Math.max(
          0,
          (vitData as { name: string }[])
            .map(({ name }) => name)
            .indexOf((vitessceURLConf as unknown as { name: string })?.name),
        );

        initializedVitDataFromUrl[initialSelectionFromUrl] =
          vitessceURLConf ?? (vitData as object[])[initialSelectionFromUrl];
        setVitessceState(initializedVitDataFromUrl[initialSelectionFromUrl] as object);
      } else {
        initializedVitDataFromUrl = (vitessceURLConf as unknown as object) ?? vitData;
        setVitessceState(initializedVitDataFromUrl);
      }
      setVitessceSelection(initialSelectionFromUrl ?? 0);
      setVitessceConfig(initializedVitDataFromUrl);
    }
  }, [setVitessceState, vitData, toastError, markerGene]);

  const currentConfig = useMemo(() => {
    if (isMultiDataset && Array.isArray(vitessceConfig) && Number.isInteger(vitessceSelection)) {
      return vitessceConfig[vitessceSelection] as VitessceConfig;
    }
    return vitessceConfig as VitessceConfig;
  }, [isMultiDataset, vitessceConfig, vitessceSelection]);

  return { vitessceConfig, vitessceSelection, setVitessceSelection, isMultiDataset, parentUuid, currentConfig };
}

// Collapse the visualization when the user presses the escape key.
export function useCollapseViz() {
  const collapseViz = useVisualizationStore((store) => store.collapseViz);
  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        collapseViz();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [collapseViz]);
  return collapseViz;
}

const FIREFOX_WARNING = 'If the performance of Vitessce in Firefox is not satisfactory, please use Chrome or Safari.';
const localStorageFirefoxWarningKey = 'vitessce-firefox-warning';

// Show a warning to Firefox users that Vitessce may be slower in Firefox.
export function useFirefoxWarning() {
  const { toastError } = useSnackbarActions();
  useEffect(() => {
    if (isFirefox && !localStorage.getItem(localStorageFirefoxWarningKey)) {
      toastError(FIREFOX_WARNING);
      localStorage.setItem(localStorageFirefoxWarningKey, 'true');
    }
  }, [toastError]);
}

// Force the canvas to not scroll when the user scrolls the page.
// This is a workaround to an issue with the Three.js spatial view where it is
// scrolling on the portal page but works as expected in the vitessce preview.
export function useCanvasScrollFix() {
  useEffect(() => {
    const canvasScrollFix = (e: WheelEvent) => {
      if (e.target && 'tagName' in e.target && e.target.tagName === 'CANVAS') {
        e.preventDefault();
      }
    };
    // The passive option is set to false so that the browser does not ignore the preventDefault call.
    document.addEventListener('wheel', canvasScrollFix, { passive: false });
    return () => {
      document.removeEventListener('wheel', canvasScrollFix);
    };
  }, []);
}
