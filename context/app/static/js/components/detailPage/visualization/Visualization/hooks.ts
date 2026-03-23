import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { decodeURLParamsToConf, VitessceConfig } from 'vitessce';
import { useQueryState, parseAsString } from 'nuqs';

import { useSnackbarActions, useSnackbarStore } from 'js/shared-styles/snackbars';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { debounce } from 'js/helpers/nodash';
import { useTotalHeaderOffset } from 'js/components/detailPage/entityHeader/EntityHeader/hooks';

import { isFirefox } from 'react-device-detect';
import { datasetSectionId } from 'js/pages/Dataset/utils';

interface UseVitessceConfigProps {
  vitData?: object | object[];
  markerGene?: string;
  hubmapId?: string;
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

export function useVitessceConfig({ vitData, markerGene, hubmapId }: UseVitessceConfigProps) {
  const [vitessceSelection, setVitessceSelection] = useState<number>(0);
  const [vitessceConfig, setVitessceConfig] = useState<object | null>(null);
  const [localVitessceState, setLocalVitessceState] = useState<unknown>(null);

  // Create a stable debounced setter for Vitessce's onConfigChange callback
  const debouncedSetterRef = useRef(debounce((val: unknown) => setLocalVitessceState(val), 250));
  const setLocalVitessceStateDebounced = useCallback((val: unknown) => debouncedSetterRef.current(val), []);

  // Cancel any pending debounced setState on unmount to avoid updates after unmount
  useEffect(() => {
    const debouncedFn = debouncedSetterRef.current;
    return () => debouncedFn.cancel();
  }, []);

  const [vizParam] = useQueryState('viz', parseAsString);
  const isTargetViz = useMemo(
    () => !vizParam || vizParam.toLowerCase() === hubmapId?.toLowerCase(),
    [vizParam, hubmapId],
  );

  const headerOffset = useTotalHeaderOffset();
  const headerOffsetRef = useRef(headerOffset);
  useEffect(() => {
    headerOffsetRef.current = headerOffset;
  }, [headerOffset]);

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
    let scrollTimeoutId: ReturnType<typeof setTimeout> | undefined;

    function setVitessceDefaults(vData: object | object[]) {
      if (Array.isArray(vData)) {
        const processedVData: object[] = vData.map((v: object) => formatVitessceConf(v));
        setLocalVitessceState(processedVData[0]);
        setVitessceConfig(processedVData);
      } else {
        const processedVData = formatVitessceConf(vData);
        setLocalVitessceState(processedVData);
        setVitessceConfig(processedVData);
      }
      setVitessceSelection(0);
    }

    if (vitData) {
      const fragment = window.location.hash.substring(1);
      if (!isTargetViz || !fragment.startsWith('vitessce_conf_')) {
        // Not the target visualization, or this is an anchor link like "#attribution"
        setVitessceDefaults(vitData);
        return undefined;
      }
      let vitessceURLConf;
      try {
        vitessceURLConf = fragment.length > 0 ? decodeURLParamsToConf(fragment) : null;
      } catch {
        // If URL cannot be parsed, display error and show Vitessce.
        toastError('View configuration from URL was not able to be parsed.');
        setVitessceDefaults(vitData);
        return undefined;
      }

      let initializedVitDataFromUrl: object | object[];
      let initialSelectionFromUrl;
      // If there is a url conf and we have a multidataset, use the url conf to find the initial selection of the multi-dataset.
      if (Array.isArray(vitData)) {
        initialSelectionFromUrl = Math.max(
          0,
          (vitData as { name: string }[])
            .map(({ name }) => name)
            .indexOf((vitessceURLConf as unknown as { name: string })?.name),
        );

        // Clone the array to avoid mutating the vitData prop
        const clonedVitData = [...vitData];
        clonedVitData[initialSelectionFromUrl] =
          (vitessceURLConf as unknown as object) ?? vitData[initialSelectionFromUrl];
        initializedVitDataFromUrl = clonedVitData;
        setLocalVitessceState(clonedVitData[initialSelectionFromUrl] as object);
      } else {
        initializedVitDataFromUrl = (vitessceURLConf as unknown as object) ?? vitData;
        setLocalVitessceState(initializedVitDataFromUrl);
      }
      setVitessceSelection(initialSelectionFromUrl ?? 0);
      setVitessceConfig(initializedVitDataFromUrl);

      // Scroll to the visualization section when loaded from a shared URL with ?viz=
      if (vizParam && hubmapId) {
        const sectionId = datasetSectionId({ hubmap_id: hubmapId }, 'visualization');
        scrollTimeoutId = setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            const sectionTop = section.getBoundingClientRect().top;
            const scrollPosition = window.scrollY + sectionTop - headerOffsetRef.current;
            window.scrollTo({ top: Math.max(scrollPosition, 0), behavior: 'smooth' });
          }
        }, 1000);
      }
    }

    return () => {
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
    };
    // markerGene is included to re-initialize when it changes (e.g., gene search)
  }, [vitData, toastError, markerGene, isTargetViz, vizParam, hubmapId]);

  const currentConfig = useMemo(() => {
    if (isMultiDataset && Array.isArray(vitessceConfig) && Number.isInteger(vitessceSelection)) {
      return vitessceConfig[vitessceSelection] as VitessceConfig;
    }
    return vitessceConfig as VitessceConfig;
  }, [isMultiDataset, vitessceConfig, vitessceSelection]);

  return {
    vitessceConfig,
    vitessceSelection,
    setVitessceSelection,
    isMultiDataset,
    parentUuid,
    currentConfig,
    localVitessceState,
    isTargetViz,
    setLocalVitessceStateDebounced,
  };
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
