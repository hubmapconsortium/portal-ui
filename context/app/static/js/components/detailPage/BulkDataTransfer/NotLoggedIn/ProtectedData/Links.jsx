import React from 'react';
import Typography from '@material-ui/core/Typography';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';

import { ExternalLink } from './style';

function GlobusAccess() {
  return (
    <Paper>
      <ExternalLink>
        <Typography variant="body1">
          <a href="/">dbGaP Study</a>
          <OutboundIconLink />
          <InfoIcon />
        </Typography>
        <Typography variant="body2">
          Navigate to the &quot;Bioproject&quot; or &quot;Sequencing Read Archive&quot; links to access the datasets.
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <Typography variant="body1">
          <a href="/">SRA Experiment</a>
          <OutboundIconLink />
          <InfoIcon />
        </Typography>
        <Typography variant="body2">
          Select the &quot;Run&quot; link on the page to download the dataset information.Here is{' '}
          <a href="/">
            additional documentation <OutboundIconLink />.
          </a>
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <Typography variant="body1">
          <a href="/">SRA Bioproject</a>
          <OutboundIconLink />
          <InfoIcon />
        </Typography>
        <Typography variant="body2">
          The Bioproject is used in the SRA Run Selector to allow you to download a manifest to bulk download datasets.
          Here is{' '}
          <a href="/">
            additional documentation <OutboundIconLink />.
          </a>
        </Typography>
      </ExternalLink>
    </Paper>
  );
}

export default GlobusAccess;
