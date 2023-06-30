import React from 'react';

import HubmapDataFooter from 'js/components/detailPage/files/HubmapDataFooter';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function VisualizationFooter({ version }) {
  return (
    <HubmapDataFooter>
      <>
        Powered by&nbsp;
        <OutboundIconLink href="http://vitessce.io">Vitessce v{version}</OutboundIconLink>
      </>
    </HubmapDataFooter>
  );
}

export default VisualizationFooter;
