import React from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import GlobusLink from './GlobusLink';
import { useFetchProtectedFile } from './hooks';
import { LoginButton } from './style';

const dbGaPTooltip =
  'The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans.';
const sraExpTooltip =
  'SRA data, available through multiple cloud providers and NCBI servers, is the largest publicly available repository of high throughput sequencing data.';

const dbGaPLink = {
  title: 'dbGaP Study',
  tooltip: dbGaPTooltip,
  description: 'Navigate to the "Bioproject" or "Sequencing Read Archive" links to access the datasets.',
  outboundLink: '',
  key: 'dbGaP',
};

const sraExperimentLink = {
  title: 'SRA Experiment',
  tooltip: sraExpTooltip,
  description: 'Select the "Run" link on the page to download the dataset information.',
  outboundLink: 'https://www.ncbi.nlm.nih.gov/sra/docs/',
  key: 'SRA Experiment',
};

const loginPanel = {
  title: 'HuBMAP Consortium Members: Globus Access',
  status: 'error',
  tooltip:
    'The database of Genotypes and Phenotypes archive and distribute data and results from studies that have investigated the interaction of genotype and phenotype in humans.',
  children: (
    <>
      This dataset contains protected-access human sequence data. If you are not a Consortium member, you must access
      these data through dbGaP if available. dbGaP authentication is required for downloading through these links. View{' '}
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
};

const noDbGaPPanel = {
  title: 'Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)',
  status: 'error',
  tooltip: 'Global research data management system.',
  children: (
    <>
      This dataset contains protected-access human sequence data. Data is not yet available through dbGaP, but will be
      available soon. Please contact{' '}
      <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
        help@hubmapconsortium.org
      </EmailIconLink>{' '}
      with any questions regarding this data.
    </>
  ),
};

const PROTECTED_DATA = {
  panels: [
    loginPanel,
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

const PROTECTED_DATA_NO_DBGAP = {
  panels: [loginPanel, noDbGaPPanel],
  links: [],
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

const NON_CONSORTIUM_MEMBERS_NO_DBGAP = {
  panels: [noDbGaPPanel],
  links: [],
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

export const usePanelSet = () => {
  const { isAuthenticated, isHubmapUser } = useAppContext();

  const {
    entity: { dbgap_study_url, mapped_data_access_level: accessType, mapped_status: status, uuid },
  } = useFlaskDataContext();

  const hasDbGaPStudyURL = Boolean(dbgap_study_url);
  const file = useFetchProtectedFile(uuid);
  const hasNoAccess = file?.status === 403;
  const isNonConsortium = !isHubmapUser;
  const unfinalizedStatuses = ['New', 'Error', 'QA', 'Processing', 'Invalid'];
  const isNotFinalized = unfinalizedStatuses.includes(status);

  if (accessType === 'Public') {
    return PUBLIC_DATA;
  }

  if (isAuthenticated) {
    // Non-consortium case if user is not in HuBMAP Globus group
    if (isNonConsortium) {
      if (hasDbGaPStudyURL) {
        return NON_CONSORTIUM_MEMBERS;
      }
      return NON_CONSORTIUM_MEMBERS_NO_DBGAP;
    }

    // If file is protected and request against the file returns 403, user has no access to protected data
    if (hasNoAccess) {
      return NO_ACCESS_TO_PROTECTED_DATA;
    }

    // If dataset status is `New`, `Error`, `QA`, `Processing`, then data is not yet available
    if (isNotFinalized) {
      return DATASET_NOT_FINALIZED;
    }

    return ACCESS_TO_PROTECTED_DATA;
  }

  // Unauthenticated cases
  if (hasDbGaPStudyURL) {
    return PROTECTED_DATA;
  }

  return PROTECTED_DATA_NO_DBGAP;
};
