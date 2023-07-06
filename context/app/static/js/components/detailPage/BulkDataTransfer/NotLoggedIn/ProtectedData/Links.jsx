import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { useFlaskDataContext } from 'js/components/Contexts';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { LinkContainer, StyledLink, LinkTitle } from './style';

function GlobusAccess() {
  const {
    entity: { dbgap_study_url, dbgap_sra_experiment_url },
  } = useFlaskDataContext();

  const LinksContentArray = [
    {
      title: 'dbGaP Study',
      url: dbgap_study_url,
      toolTip: '',
      description: 'Navigate to the "Bioproject" or "Sequencing Read Archive" links to access the datasets.',
      outBoundLink: '',
    },
    {
      title: 'SRA Experiment',
      url: dbgap_sra_experiment_url,
      toolTip:
        'SRA data, available through multiple cloud providers and NCBI servers, is the largest publicly available repository of high throughput sequencing data.',
      description: 'Select the "Run" link on the page to download the dataset information.',
      outBoundLink: 'https://www.ncbi.nlm.nih.gov/sra/docs/',
    },
  ];

  return (
    <Paper>
      {LinksContentArray.map((link) => (
        <LinkContainer>
          <StyledLink variant="body1">
            {link.url ? (
              <OutboundIconLink href={link.url}>{link.title}</OutboundIconLink>
            ) : (
              <LinkTitle variant="body1">{link.title}</LinkTitle>
            )}
            {link.toolTip && (
              <SecondaryBackgroundTooltip title={link.toolTip}>
                <InfoIcon />
              </SecondaryBackgroundTooltip>
            )}
          </StyledLink>
          <Typography variant="body2">{link.description}</Typography>
          {link.outBoundLink && (
            <OutboundIconLink href={link.outBoundLink}> Here is additional documentation.</OutboundIconLink>
          )}
        </LinkContainer>
      ))}
    </Paper>
  );
}

export default GlobusAccess;
