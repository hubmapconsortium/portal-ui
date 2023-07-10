import React from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { LightBlueLink } from 'js/shared-styles/Links';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import GlobusAccess from '../../GlobusAccess';
import DbGaP from '../../DbGaP';
import Links from '../../Links';
import { StyledContainer } from '../../style';

function ProtectedData() {
  return (
    <StyledContainer>
      <GlobusAccess
        title="HuBMAP Consortium Members: Globus Access"
        status="error"
        tooltipText="Global research data management system"
        loginButton
      >
        Please <LightBlueLink href="/login">log in</LightBlueLink> for Globus access or email{' '}
        <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </EmailIconLink>{' '}
        with the dataset ID about the files you are trying to access.
      </GlobusAccess>
      <DbGaP
        title="Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)"
        status="success"
        tooltipText="The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans."
      >
        This dataset contains protected-access human sequence data. If you are not a Consortium member, you must access
        these data through dbGaP if available. dbGaP authentication is required for downloading through these links.
        View{' '}
        <OutboundLink href="https://sharing.nih.gov/accessing-data/accessing-genomic-data/how-to-request-and-access-datasets-from-dbgap#block-bootstrap5-subtheme-page-title">
          documentation
        </OutboundLink>{' '}
        on how to attain dbGaP access.
      </DbGaP>
      <Links />
    </StyledContainer>
  );
}

export default ProtectedData;
