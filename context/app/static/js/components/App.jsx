import React, { StrictMode } from 'react';
import { pdfjs } from 'react-pdf';
import { enableMapSet } from 'immer';

import StyledSnackbar from 'js/shared-styles/snackbars';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';
import { StyledAlert, FlexContainer } from './style';
import LaunchWorkspaceDialog from './workspaces/LaunchWorkspaceDialog/LaunchWorkspaceDialog';
import EditWorkspaceDialog from './workspaces/EditWorkspaceDialog';
import MarkdownRenderer from './Markdown/MarkdownRenderer';
import OpenKeyNavInitializer from './OpenKeyNavInitializer';

// Enable use of Map and Set in immer
enableMapSet();

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App(props) {
  const {
    flaskData,
    groupsToken,
    isAuthenticated,
    userEmail,
    workspacesToken,
    userGroups = [],
    userFirstName,
    userLastName,
    userGlobusId,
    userGlobusAffiliation,
  } = props;

  const { endpoints, globalAlertMd } = flaskData;
  delete flaskData.endpoints;
  delete flaskData.globalAlertMd;
  const isHubmapUser = userGroups?.includes('HuBMAP');
  const isWorkspacesUser = userGroups?.includes('Workspaces') || isHubmapUser;

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
        userFirstName={userFirstName}
        userLastName={userLastName}
        userGlobusId={userGlobusId}
        userGlobusAffiliation={userGlobusAffiliation}
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
        <OpenKeyNavInitializer />
      </Providers>
    </StrictMode>
  );
}
export default App;
