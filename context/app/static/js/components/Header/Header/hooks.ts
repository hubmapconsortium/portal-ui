import useVisualizationStore from 'js/stores/useVisualizationStore';
import useEntityStore from 'js/stores/useEntityStore';

const pathsWithEntityHeader = ['/browse', '/cell-types', '/genes'];

const exceptionPaths = ['/browse/collection'];

function locationStartsWithPath(path: string) {
  return window.location.pathname.startsWith(path);
}

export function useEntityHeaderVisibility() {
  const { summaryInView, summaryEntry } = useEntityStore((state) => state.summaryComponentObserver);
  const vizIsFullscreen = useVisualizationStore((state) => state.vizIsFullscreen);

  const matchesPath = pathsWithEntityHeader.some(locationStartsWithPath);
  const isExceptionPath = exceptionPaths.some(locationStartsWithPath);

  const shouldDisplayHeader = vizIsFullscreen || Boolean(summaryEntry && matchesPath && !isExceptionPath);
  const elevation = !summaryInView || vizIsFullscreen ? 0 : 4;
  const shouldConstrainWidth = !vizIsFullscreen;

  return { shouldDisplayHeader, elevation, shouldConstrainWidth };
}
