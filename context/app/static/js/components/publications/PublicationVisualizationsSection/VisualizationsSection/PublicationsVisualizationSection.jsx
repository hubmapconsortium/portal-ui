import React from 'react';

import PublicationVignette from 'js/components/publications/PublicationVignette';

function PublicationsVisualizationSection({ vignette_data, uuid }) {
  return Object.entries(vignette_data).map(([k, v]) => {
    return <PublicationVignette vignette={v} uuid={uuid} key={k} vignetteDirName={k} />;
  });
}

export default PublicationsVisualizationSection;
