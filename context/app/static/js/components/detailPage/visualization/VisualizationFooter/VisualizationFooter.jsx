import React from 'react';
import Typography from '@material-ui/core/Typography';

import HubmapDataFooter from 'js/components/detailPage/files/HubmapDataFooter';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function VisualizationFooter({ version }) {
  return (
    <HubmapDataFooter>
      <Typography variant="caption">
        Powered by&nbsp;
        <OutboundIconLink href="http://vitessce.io">Vitessce v{version}</OutboundIconLink>
      </Typography>
    </HubmapDataFooter>
  );
}

export default VisualizationFooter;
