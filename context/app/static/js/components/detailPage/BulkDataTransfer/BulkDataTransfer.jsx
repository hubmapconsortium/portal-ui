import React, { useState, useMemo, useCallback } from 'react';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { FilesContext, useAppContext, useDetailContext, useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import FileBrowserDUA from './FileBrowserDUA';
import BulkDataTransferPanel from './BulkDataTransferPanel';
import Link from './Link';
import GlobusLink from './GlobusLink';
import NoAccess from './NoAccess';
import { useIsProtectedFile } from './hooks';
import { LoginButton, StyledContainer } from './style';

const dbGaPTooltip =
  'The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans.';
const sraExpTooltip =
  'SRA data, available through multiple cloud providers and NCBI servers, is the largest publicly available repository of high throughput sequencing data.';

const dbGaPLink = {
  title: 'dbGaP Study',
  tooltip: dbGaPTooltip,
  description: 'Navigate to the "Bioproject" or "Sequencing Read Archive" links to access the datasets.',
  outBoundLink: '',
  key: 'dbGaP',
};

const sraExperimentLink = {
  title: 'SRA Experiment',
  tooltip: sraExpTooltip,
  description: 'Select the "Run" link on the page to download the dataset information.',
  outBoundLink: 'https://www.ncbi.nlm.nih.gov/sra/docs/',
  key: 'SRA Experiment',
};

const PROTECTED_DATA = {
  panels: [
    {
      title: 'HuBMAP Consortium Members: Globus Access',
      status: 'error',
      tooltip:
        'The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans.',
      children: (
        <>
          This dataset contains protected-access human sequence data. If you are not a Consortium member, you must
          access these data through dbGaP if available. dbGaP authentication is required for downloading through these
          links. View{' '}
          <OutboundLink href="https://sharing.nih.gov/accessing-data/accessing-genomic-data/how-to-request-and-access-datasets-from-dbgap#block-bootstrap5-subtheme-page-title">
            documentation
          </OutboundLink>{' '}
          on how to attain dbGaP access.
        </>
      ),
      addOns: (
        <LoginButton href="/login" variant="contained" color="primary">
          Member Login
        </LoginButton>
      ),
    },
    {
      title: 'Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)',
      status: 'success',
      tooltip:
        'The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans.',
      children: (
        <>
          This dataset contains protected-access human sequence data. If you are not a Consortium member, you must
          access these data through dbGaP if available. dbGaP authentication is required for downloading through these
          links. View{' '}
          <OutboundLink href="https://sharing.nih.gov/accessing-data/accessing-genomic-data/how-to-request-and-access-datasets-from-dbgap#block-bootstrap5-subtheme-page-title">
            documentation
          </OutboundLink>{' '}
          on how to attain dbGaP access.
        </>
      ),
    },
  ],
  links: [dbGaPLink, sraExperimentLink],
};

const PUBLIC_DATA = {
  panels: [
    {
      title: 'HuBMAP Consortium Members: Globus Access',
      status: 'success',
      tooltip: 'Global research data management system.',
      children: (
        <>
          Files are available through the Globus Research Data Management System. If you require additional help, email{' '}
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          with the dataset ID and information about the files you are trying to access.
        </>
      ),
    },
  ],
  links: [<GlobusLink />],
};

const ACCESS_TO_PROTECTED_DATA = {
  panels: [
    {
      title: 'HuBMAP Consortium Members: Globus Access',
      status: 'success',
      children: (
        <>
          You are authorized to access protected-access human sequence data through the Globus Research Data Management
          System. Please review and follow all{' '}
          <OutboundLink href="https://hubmapconsortium.org/policies/">policies</OutboundLink> related to the use of
          these protected data. If you require additional help, email{' '}
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          with the dataset ID and information about the files you are trying to access.
        </>
      ),
    },
  ],
  links: [<GlobusLink />],
};

const NO_ACCESS_TO_PROTECTED_DATA = {
  error: (
    <div>
      This dataset contains protected-access human sequence data. Please ask the PI of your HuBMAP award to email{' '}
      <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
        help@hubmapconsortium.org
      </EmailIconLink>{' '}
      to get you access to protected HuBMAP data through Globus.
    </div>
  ),
};

const NON_CONSORTIUM_MEMBERS = {
  panels: [
    {
      title: 'Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)',
      status: 'success',
      tooltip: 'Global research data management system.',
      children: (
        <>
          This dataset contains protected-access human sequence data. If you are not a Consortium member, you must
          access these data through dbGaP if available. dbGaP authentication is required for downloading through these
          links. View documentation on how to attain dbGaP access. For additional help, email
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          with the dataset ID and information about the files you are trying to access.
        </>
      ),
    },
  ],
  links: [dbGaPLink, sraExperimentLink],
};

const DATASET_NOT_FINALIZED = {
  error: (
    <div>
      These data are still being prepared, processed, or curated and will only be available to members of the team who
      submitted the data. For additional help, email
      <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
        help@hubmapconsortium.org
      </EmailIconLink>
      .
    </div>
  ),
};

const useBulkDataTransferPanels = () => {
  const { isAuthenticated, isHubmapUser } = useAppContext();
  const {
    entity: { mapped_data_access_level: accessType, mapped_status: status, uuid },
  } = useFlaskDataContext();
  const hasNoAccess = useIsProtectedFile(uuid);
  if (isAuthenticated) {
    if (hasNoAccess) {
      return NO_ACCESS_TO_PROTECTED_DATA;
    }
    // Non-consortium case if user is not in HuBMAP Globus group
    const isNonConsortium = !isHubmapUser;
    if (isNonConsortium) {
      return NON_CONSORTIUM_MEMBERS;
    }
    // If dataset status is `New`, `Error`, `QA`, `Processing`, then data is not yet available
    const unfinalizedStatuses = ['New', 'Error', 'QA', 'Processing'];
    const isNotFinalized = unfinalizedStatuses.includes(status);
    if (isNotFinalized) {
      return DATASET_NOT_FINALIZED;
    }
    return ACCESS_TO_PROTECTED_DATA;
  }
  // Unauthenticated cases
  if (accessType === 'Protected') {
    return PROTECTED_DATA;
  }
  return PUBLIC_DATA;
};

function BulkDataTransfer() {
  const { mapped_data_access_level } = useDetailContext();
  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState(localStorage.getItem(localStorageKey));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [urlClickedBeforeDUA, setUrlClickedBeforeDUA] = useState('');

  const {
    entity: { dbgap_study_url, dbgap_sra_experiment_url },
  } = useFlaskDataContext();

  // Assign dynamic URL's to each type of link
  const linkTitleUrlMap = {
    dbGaP: dbgap_study_url,
    'SRA Experiment': dbgap_sra_experiment_url,
  };

  const handleDUAAgree = useCallback(() => {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, true);
    setDialogOpen(false);
    window.open(urlClickedBeforeDUA, '_blank');
  }, [agreeToDUA, localStorageKey, setDialogOpen, urlClickedBeforeDUA]);

  const handleDUAClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openDUA = useCallback((linkUrl) => {
    setDialogOpen(true);
    setUrlClickedBeforeDUA(linkUrl);
  }, []);

  const filesContext = useMemo(() => ({ openDUA, hasAgreedToDUA }), [openDUA, hasAgreedToDUA]);

  const panelsToUse = useBulkDataTransferPanels();

  return (
    <FilesContext.Provider value={filesContext}>
      <DetailPageSection id="bulk-data-transfer">
        <SectionHeader>Bulk Data Transfer</SectionHeader>
        <StyledContainer>
          {panelsToUse.error ? (
            <NoAccess>{panelsToUse.error}</NoAccess>
          ) : (
            <>
              {panelsToUse.panels.length > 0 &&
                panelsToUse.panels.map((props) => <BulkDataTransferPanel {...props} key={props.title} />)}
              {panelsToUse.links.length > 0 && (
                <Paper>
                  {panelsToUse.links.map((link) =>
                    React.isValidElement(link) ? (
                      link
                    ) : (
                      <Link {...link} key={link.key} url={linkTitleUrlMap[link.title]} />
                    ),
                  )}
                </Paper>
              )}
            </>
          )}
        </StyledContainer>
      </DetailPageSection>
      <FileBrowserDUA
        isOpen={isDialogOpen}
        handleAgree={handleDUAAgree}
        handleClose={handleDUAClose}
        mapped_data_access_level={mapped_data_access_level}
      />
    </FilesContext.Provider>
  );
}

export default BulkDataTransfer;
