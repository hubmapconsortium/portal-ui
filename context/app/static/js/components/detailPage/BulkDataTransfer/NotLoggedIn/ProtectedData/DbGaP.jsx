import React from 'react';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Header } from './style';

function DbGaP() {
  return (
    <DetailSectionPaper>
      <Header variant="h5">
        Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)
        <CheckCircleIcon style={{ color: '#6c8938' }} fontSize="small" />
        <SecondaryBackgroundTooltip title="The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans">
          <InfoIcon fontSize="small" />
        </SecondaryBackgroundTooltip>
      </Header>
      <Typography variant="body2">
        This dataset contains protected-access human sequence data. If you are not a Consortium member, you must access
        these data through dbGaP if available. dbGaP authentication is required for downloading through these links.
        View{' '}
        <a
          href="https://sharing.nih.gov/accessing-data/accessing-genomic-data/how-to-request-and-access-datasets-from-dbgap#block-bootstrap5-subtheme-page-title"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentation
        </a>{' '}
        on how to attain dbGaP access.
      </Typography>
    </DetailSectionPaper>
  );
}

export default DbGaP;
