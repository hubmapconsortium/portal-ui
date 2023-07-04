import React from 'react';
import Typography from '@material-ui/core/Typography';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Paper from '@material-ui/core/Paper';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { ExternalLink, StyledLink, StyledAnchorTag } from './style';

function GlobusAccess() {
  return (
    <Paper>
      <ExternalLink>
        <StyledLink variant="body1">
          <a href="/" target="_blank" rel="noopener noreferrer">
            dbGaP Study
          </a>
          <OutboundIconLink />
          <InfoIcon />
        </StyledLink>
        <Typography variant="body2">
          Navigate to the &quot;Bioproject&quot; or &quot;Sequencing Read Archive&quot; links to access the datasets.
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <StyledLink variant="body1">
          <a href="/" target="_blank" rel="noopener noreferrer">
            SRA Experiment
          </a>
          <OutboundIconLink />
          <SecondaryBackgroundTooltip title="SRA data, available through multiple cloud providers and NCBI servers, is the largest publicly available repository of high throughput sequencing data.">
            <InfoIcon />
          </SecondaryBackgroundTooltip>
        </StyledLink>
        <Typography variant="body2">
          Select the &quot;Run&quot; link on the page to download the dataset information.Here is{' '}
          <StyledAnchorTag href="https://www.ncbi.nlm.nih.gov/sra/docs/" target="_blank" rel="noopener noreferrer">
            additional documentation <OutboundIconLink />.
          </StyledAnchorTag>
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <StyledLink variant="body1">
          <a href="/" target="_blank" rel="noopener noreferrer">
            SRA Bioproject
          </a>
          <OutboundIconLink />
          <SecondaryBackgroundTooltip title="The SRA Run Selector selects runs from one or more studies to download or analyze with the SRA Toolkit.">
            <InfoIcon />
          </SecondaryBackgroundTooltip>
        </StyledLink>
        <Typography variant="body2">
          The Bioproject is used in the SRA Run Selector to allow you to download a manifest to bulk download datasets.
          Here is{' '}
          <StyledAnchorTag
            href="https://www.ncbi.nlm.nih.gov/sra/docs/sradownload/"
            target="_blank"
            rel="noopener noreferrer"
          >
            additional documentation <OutboundIconLink />.
          </StyledAnchorTag>
        </Typography>
      </ExternalLink>
    </Paper>
  );
}

export default GlobusAccess;
