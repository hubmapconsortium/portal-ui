import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { useFlaskDataContext } from 'js/components/Contexts';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { ExternalLink, StyledLink, StyledAnchorTag } from './style';

function GlobusAccess() {
  const {
    entity: { dbgap_study_url, dbgap_sra_experiment_url },
  } = useFlaskDataContext();
  return (
    <Paper>
      <ExternalLink>
        <StyledLink variant="body1">
          <OutboundIconLink href={dbgap_study_url} target="_blank" rel="noopener noreferrer">
            dbGaP Study
          </OutboundIconLink>
          <InfoIcon />
        </StyledLink>
        <Typography variant="body2">
          Navigate to the &quot;Bioproject&quot; or &quot;Sequencing Read Archive&quot; links to access the datasets.
        </Typography>
      </ExternalLink>
      <ExternalLink>
        <StyledLink variant="body1">
          <OutboundIconLink href={dbgap_sra_experiment_url} target="_blank" rel="noopener noreferrer">
            SRA Experiment
          </OutboundIconLink>
          <SecondaryBackgroundTooltip title="SRA data, available through multiple cloud providers and NCBI servers, is the largest publicly available repository of high throughput sequencing data.">
            <InfoIcon />
          </SecondaryBackgroundTooltip>
        </StyledLink>
        <Typography variant="body2">
          Select the &quot;Run&quot; link on the page to download the dataset information. Here is{' '}
          <StyledAnchorTag href="https://www.ncbi.nlm.nih.gov/sra/docs/" target="_blank" rel="noopener noreferrer">
            additional documentation. <OutboundIconLink />
          </StyledAnchorTag>
        </Typography>
      </ExternalLink>
    </Paper>
  );
}

export default GlobusAccess;
