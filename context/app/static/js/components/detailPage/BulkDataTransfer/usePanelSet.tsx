import React from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { InternalLink } from 'js/shared-styles/Links';
import { useAppContext } from 'js/components/Contexts';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { useFetchProtectedFile } from './hooks';
import { LoginButton } from './style';

const dbGaPText = {
  title: 'Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)',
  tooltip:
    'The database of Genotypes and Phenotypes archives and distributes data and results from studies that have investigated the interaction of genotype and phenotype in humans.',
};

const globusText = {
  title: 'HuBMAP Consortium Members: Globus Access',
  tooltip: 'Global research data management system.',
};

const dbGaPTooltip = (
  <>
    dbGap <InfoTooltipIcon iconTooltipText="Database of Genotypes and Phenotypes" noMargin />
  </>
);

interface GlobusPanel {
  title: string;
  tooltip: string;
  description?: string;
  outboundLink?: string;
  key?: string;
  status: 'success' | 'error';
  children: React.ReactNode;
  addOns?: React.ReactNode;
}

const loginPanel: GlobusPanel = {
  ...globusText,
  status: 'error',
  children: (
    <>
      Please <InternalLink href="/login">log in</InternalLink> for Globus access or <ContactUsLink variant="body2" />{' '}
      with the dataset ID about the files you are trying to access.
    </>
  ),
  addOns: (
    <LoginButton href="/login" variant="contained" color="primary">
      Member Login
    </LoginButton>
  ),
};

const dbGaPPanel: GlobusPanel = {
  ...dbGaPText,
  status: 'success',
  children: (
    <>
      This dataset contains protected-access human sequence data. If you are not a Consortium member, you must access
      these data through {dbGaPTooltip} if available. dbGaP authentication is required for downloading through these
      links. View{' '}
      <OutboundLink href="https://sharing.nih.gov/accessing-data/accessing-genomic-data/how-to-request-and-access-datasets-from-dbgap#block-bootstrap5-subtheme-page-title">
        documentation
      </OutboundLink>{' '}
      on how to attain dbGaP access.
    </>
  ),
};

const noGlobusAccessWhileLoggedInPanel: GlobusPanel = {
  ...globusText,
  status: 'error',
  children: (
    <>
      This dataset includes protected-access human sequence data. To obtain access, please request the PI of your HuBMAP
      award to contact us and submit a ticket to get you access to this data through Globus. While {dbGaPTooltip} is
      available, Globus offers comprehensive data for approved HuBMAP members. For additional help,{' '}
      <ContactUsLink variant="body2" /> with the dataset ID and information about the files you are trying to access.
    </>
  ),
};

interface SuccessPanelSet {
  panels: GlobusPanel[];
  showGlobus?: boolean;
  showDbGaP?: boolean;
  showSRA?: boolean;
}

interface ErrorPanelSet {
  error: {
    status: 'error' | 'warning';
    title?: string;
    tooltip?: string;
    children: React.ReactNode;
  };
}

type PanelSet = SuccessPanelSet | ErrorPanelSet;

const PROTECTED_DATA_NOT_LOGGED_IN: SuccessPanelSet = {
  panels: [loginPanel, dbGaPPanel],
  showDbGaP: true,
  showSRA: true,
};

const PROTECTED_DATA_LOGGED_IN_NO_GLOBUS_ACCESS: SuccessPanelSet = {
  panels: [noGlobusAccessWhileLoggedInPanel],
};

const noDbGaPPanel: GlobusPanel = {
  ...dbGaPText,
  status: 'error' as const,
  children: (
    <>
      This dataset contains protected-access human sequence data. Data is not yet available through {dbGaPTooltip}, but
      will be available soon. Please <ContactUsLink variant="body2" /> with any questions regarding this data.
    </>
  ),
};

const PROTECTED_DATA_NO_DBGAP: SuccessPanelSet = {
  panels: [loginPanel, noDbGaPPanel],
};

const PUBLIC_DATA: SuccessPanelSet = {
  panels: [
    {
      title: 'HuBMAP Globus Access',
      tooltip: globusText.tooltip,
      status: 'success',
      children: (
        <>
          Files are available through the Globus Research Data Management System. If you require additional help,{' '}
          <ContactUsLink variant="body2" /> with the dataset ID and information about the files you are trying to
          access.
        </>
      ),
    },
  ],
  showGlobus: true,
};

const ACCESS_TO_PROTECTED_DATA: SuccessPanelSet = {
  panels: [
    {
      ...globusText,
      status: 'success',
      children: (
        <>
          You are authorized to access protected-access human sequence data through the Globus Research Data Management
          System. Please review and follow all{' '}
          <OutboundLink href="https://hubmapconsortium.org/policies/">policies</OutboundLink> related to the use of
          these protected data. If you require additional help, <ContactUsLink variant="body2" /> with the dataset ID
          and information about the files you are trying to access.
        </>
      ),
    },
  ],
  showGlobus: true,
};

const NO_ACCESS_TO_PROTECTED_DATA: ErrorPanelSet = {
  error: {
    status: 'warning',
    children: (
      <div>
        This dataset contains protected-access human sequence data. Please ask the PI of your HuBMAP award to{' '}
        <ContactUsLink variant="body2" /> and submit a ticket to get you access to protected HuBMAP data through Globus.
      </div>
    ),
  },
};

const NON_CONSORTIUM_MEMBERS: SuccessPanelSet = {
  panels: [
    {
      ...dbGaPText,
      status: 'success',
      children: (
        <>
          This dataset contains protected-access human sequence data. If you are not a Consortium member, you must
          access these data through dbGaP if available. dbGaP authentication is required for downloading through these
          links. View documentation on how to attain dbGaP access. For additional help,{' '}
          <ContactUsLink variant="body2" /> with the dataset ID and information about the files you are trying to
          access.
        </>
      ),
    },
  ],
  showDbGaP: true,
  showSRA: true,
};

const NON_CONSORTIUM_MEMBERS_NO_DBGAP: SuccessPanelSet = {
  panels: [noDbGaPPanel],
};

const ENTITY_API_ERROR: ErrorPanelSet = {
  error: {
    status: 'error',
    title: 'HuBMAP Globus Access',
    tooltip: globusText.tooltip,
    children: (
      <>
        The API failed to retrieve the link to Globus. Please{' '}
        <ContactUsLink variant="body2"> report this issue</ContactUsLink> with the dataset ID and information about the
        files you are trying to access.
      </>
    ),
  },
};

function getGlobusPanel(status: number | undefined, panel: PanelSet, isLoading: boolean) {
  if (isLoading) {
    return panel;
  }

  if (status !== 200) {
    return ENTITY_API_ERROR;
  }

  return panel;
}

export const usePanelSet: (uuid: string, dbGapStudyURL?: string, accessType?: string) => PanelSet = (
  uuid,
  dbGapStudyURL,
  accessType,
) => {
  const { isAuthenticated, isHubmapUser } = useAppContext();

  const hasDbGaPStudyURL = Boolean(dbGapStudyURL);
  const { status: globusURLStatus, isLoading: globusURLIsLoading } = useFetchProtectedFile(uuid);
  const hasNoAccess = globusURLStatus === 403;
  const isNonConsortium = !isHubmapUser;

  if (!accessType || accessType !== 'Protected') {
    return getGlobusPanel(globusURLStatus, PUBLIC_DATA, globusURLIsLoading);
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
      if (hasDbGaPStudyURL) {
        return PROTECTED_DATA_LOGGED_IN_NO_GLOBUS_ACCESS;
      }
      return NO_ACCESS_TO_PROTECTED_DATA;
    }

    return getGlobusPanel(globusURLStatus, ACCESS_TO_PROTECTED_DATA, globusURLIsLoading);
  }

  // Unauthenticated cases
  if (hasDbGaPStudyURL) {
    return PROTECTED_DATA_NOT_LOGGED_IN;
  }

  return PROTECTED_DATA_NO_DBGAP;
};
