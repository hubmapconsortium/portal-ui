import React, { StrictMode } from 'react';
import { pdfjs } from 'react-pdf';
import { enableMapSet } from 'immer';

import StyledSnackbar from 'js/shared-styles/snackbars';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';
import { StyledAlert, FlexContainer } from './style';
// Importing Search styles here so the CSS import order is correct.
import 'js/components/searchPage/Search.scss';
import LaunchWorkspaceDialog from './workspaces/LaunchWorkspaceDialog/LaunchWorkspaceDialog';
import EditWorkspaceDialog from './workspaces/EditWorkspaceDialog';
import MarkdownRenderer from './Markdown/MarkdownRenderer';

// TODO: Delete this when workspaces are publicly released.
// If we stay in limbo for a long time, this configuration could be moved out of code.
const workspacesUsers = [
  'nils@hms.harvard.edu',
  'john_conroy@hms.harvard.edu',
  'tiffany_liaw@hms.harvard.edu',
  'tony_hsiao@hms.harvard.edu',
  'morgan_turner@hms.harvard.edu',
  'lisa_choy@hms.harvard.edu',
  'tsmits@hms.harvard.edu',
  'pdblood@andrew.cmu.edu',
  'blood@psc.edu',
  'jpuerto@andrew.cmu.edu',
  'gphillip@andrew.cmu.edu',
  'ivlachos@bidmc.harvard.edu',
  'geremy.clair@pnnl.gov',
];

// Enable use of Map and Set in immer
enableMapSet();

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App(props) {
  const { flaskData, groupsToken, isAuthenticated, userEmail, workspacesToken, userGroups = [] } = props;

  const { endpoints, globalAlertMd } = flaskData;
  delete flaskData.endpoints;
  delete flaskData.globalAlertMd;
  const isHubmapUser = userGroups?.includes('HuBMAP');
  const isWorkspacesUser = userGroups?.includes('Workspaces') || workspacesUsers.includes(userEmail) || isHubmapUser;

  return (
    <StrictMode>
      <Providers
        endpoints={endpoints}
        groupsToken={groupsToken}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        workspacesToken={workspacesToken}
        isWorkspacesUser={isWorkspacesUser}
        isHubmapUser={isHubmapUser}
        flaskData={flaskData}
      >
        <Header />
        {globalAlertMd && (
          <FlexContainer>
            <StyledAlert severity="warning">
              <MarkdownRenderer>{globalAlertMd}</MarkdownRenderer>
            </StyledAlert>
          </FlexContainer>
        )}
        <Routes flaskData={flaskData} />
        <Footer />
        <StyledSnackbar />
        {/* These dialogs are placed at the root of the application because 
            they are launchable from many places. In the future, this should be
            improved on by using a global modal stack with portals. */}
        <LaunchWorkspaceDialog />
        <EditWorkspaceDialog />
      </Providers>
    </StrictMode>
  );
}
export default App;
