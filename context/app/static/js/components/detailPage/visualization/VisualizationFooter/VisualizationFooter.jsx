import React from 'react';
import Typography from '@material-ui/core/Typography';

import SectionFooter from 'js/shared-styles/sections/SectionFooter';
import AboutThisDataCaption from 'js/components/detailPage/files/AboutThisDataCaption';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function VisualizationFooter({ version }) {
  return (
    <SectionFooter>
      <Typography variant="caption">
        Powered by&nbsp;
        <OutboundIconLink href="http://vitessce.io">Vitessce v{version}</OutboundIconLink>
      </Typography>
      <AboutThisDataCaption />
    </SectionFooter>
  );
}

export default VisualizationFooter;
