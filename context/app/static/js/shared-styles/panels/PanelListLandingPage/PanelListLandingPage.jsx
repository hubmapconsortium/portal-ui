import React from 'react';
import Typography from '@material-ui/core/Typography';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PageWrapper, StyledDescription } from './style';

function PanelListLandingPage({ title, subtitle, description, panelsProps }) {
  return (
    <PageWrapper>
      <Typography variant="h2" component="h1">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {subtitle}
      </Typography>
      <StyledDescription>{description}</StyledDescription>
      {panelsProps.length > 0 && <PanelList panelsProps={panelsProps} />}
    </PageWrapper>
  );
}

export default PanelListLandingPage;
