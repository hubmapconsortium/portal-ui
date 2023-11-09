import React from 'react';

import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import useStickyToggle from 'js/hooks/useStickyToggle';

import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import { usePublicationVignetteConfs } from './hooks';

function PublicationVignette({ vignette, vignetteDirName, uuid, mounted }) {
  const vitessceConfs = usePublicationVignetteConfs({
    uuid,
    vignette,
    vignetteDirName,
  });

  // Workaround to make the visualization render only after the accordion section has been expanded while
  // still letting the prerequisites for the visualizations prefetch
  const hasBeenMounted = useStickyToggle(mounted);

  return (
    <>
      <MarkdownRenderer>{vignette.description}</MarkdownRenderer>
      {vitessceConfs && (
        <VisualizationWrapper
          vitData={vitessceConfs.length === 1 ? vitessceConfs[0] : vitessceConfs}
          uuid={uuid}
          hasNotebook={false}
          shouldDisplayHeader={false}
          hasBeenMounted={hasBeenMounted}
          isPublicationPage
        />
      )}
    </>
  );
}

export default PublicationVignette;
