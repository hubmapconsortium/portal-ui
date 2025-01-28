import React from 'react';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { bodyExpandedCSS } from './style';

const visualizationStoreSelector = (state: VisualizationStore) => state.fullscreenVizId;

interface BodyExpandedCSSProps {
  id: string;
}

export default function BodyExpandedCSS({ id }: BodyExpandedCSSProps) {
  const fullscreenVizId = useVisualizationStore(visualizationStoreSelector);
  const vizIsFullscreen = fullscreenVizId === id;
  return <style type="text/css">{vizIsFullscreen && bodyExpandedCSS}</style>;
}
