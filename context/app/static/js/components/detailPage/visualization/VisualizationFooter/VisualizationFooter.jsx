import React from 'react';

import HubmapDataFooter from 'js/components/detailPage/files/HubmapDataFooter';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function VisualizationFooter({ version }) {
  return (
    <HubmapDataFooter
      items={[
        {
          key: 'vitessce-link',
          component: (
            <>
              Powered by&nbsp;
              <OutboundIconLink href="http://vitessce.io">Vitessce v{version}</OutboundIconLink>
            </>
          ),
        },
      ]}
    />
  );
}

export default VisualizationFooter;
