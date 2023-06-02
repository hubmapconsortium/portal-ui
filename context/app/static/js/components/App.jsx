import React from 'react';
import marked from 'marked';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

import { StyledAlert, FlexContainer } from './style';

// Importing Search styles here so the CSS import order is correct.
import 'js/components/searchPage/Search.scss';

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

const FlaskDataContext = React.createContext({});

function App(props) {
  const { flaskData, groupsToken, isAuthenticated, userEmail, workspacesToken, userGroups = [] } = props;
  const { endpoints, globalAlertMd } = flaskData;
  delete flaskData.endpoints;
  delete flaskData.globalAlertMd;

  const isWorkspacesUser = userGroups.includes('Workspaces') || workspacesUsers.includes(userEmail);

  return (
    <Providers
      endpoints={endpoints}
      groupsToken={groupsToken}
      isAuthenticated={isAuthenticated}
      userEmail={userEmail}
      workspacesToken={workspacesToken}
      isWorkspacesUser={isWorkspacesUser}
      flaskData={flaskData}
    >
      <Header />
      {globalAlertMd && (
        <FlexContainer>
          <StyledAlert severity="warning">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: marked.parseInline(globalAlertMd) }} />
          </StyledAlert>
        </FlexContainer>
      )}
      <FlaskDataContext.Provider value={flaskData}>
        <Routes flaskData={flaskData} />
      </FlaskDataContext.Provider>
      <Footer />
    </Providers>
  );
}
export { FlaskDataContext };
export default App;
