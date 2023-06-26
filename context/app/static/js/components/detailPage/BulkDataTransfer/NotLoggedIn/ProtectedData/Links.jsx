import React from 'react';
import Typography from '@material-ui/core/Typography';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Paper from '@material-ui/core/Paper';

import { InfoIcon } from 'js/shared-styles/icons';
import { ExternalLink, StyledLink, StyledAnchorTag } from './style';

function GlobusAccess() {
  return (
    <Paper>
      <ExternalLink>
        <StyledLink variant="body1">
          <a href="/">dbGaP Study</a>
          <OutboundIconLink />
          <InfoIcon />
        </StyledLink>
        <Typography variant="body2">
          Navigate to the &quot;Bioproject&quot; or &quot;Sequencing Read Archive&quot; links to access the datasets.
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <StyledLink variant="body1">
          <a href="/">SRA Experiment</a>
          <OutboundIconLink />
          <InfoIcon />
        </StyledLink>
        <Typography variant="body2">
          Select the &quot;Run&quot; link on the page to download the dataset information.Here is{' '}
          <StyledAnchorTag href="/">
            additional documentation <OutboundIconLink />.
          </StyledAnchorTag>
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <StyledLink variant="body1">
          <a href="/">SRA Bioproject</a>
          <OutboundIconLink />
          <InfoIcon />
        </StyledLink>
        <Typography variant="body2">
          The Bioproject is used in the SRA Run Selector to allow you to download a manifest to bulk download datasets.
          Here is{' '}
          <StyledAnchorTag href="/">
            additional documentation <OutboundIconLink />.
          </StyledAnchorTag>
        </Typography>
      </ExternalLink>
    </Paper>
  );
}

export default GlobusAccess;
