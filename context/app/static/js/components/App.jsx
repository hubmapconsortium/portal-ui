import React from 'react';
import ReactGA from 'react-ga';
import marked from 'marked';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

import { StyledAlert, FlexContainer } from './style';

// Importing Search styles here so the CSS import order is correct.
import 'js/components/searchPage/Search.scss';

function App(props) {
  const { flaskData } = props;
  const { endpoints, globalAlertMd } = flaskData;
  delete flaskData.endpoints;
  delete flaskData.globalAlertMd;
  ReactGA.initialize('UA-133341631-3');

  return (
    // Token are injected as globals in the flask template.
    // eslint-disable-next-line no-undef
    <Providers endpoints={endpoints} groupsToken={groups_token} workspacesToken={workspaces_token}>
      <Header />
      {globalAlertMd && (
        <FlexContainer>
          <StyledAlert severity="warning">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: marked.parseInline(globalAlertMd) }} />
          </StyledAlert>
        </FlexContainer>
      )}
      <Routes flaskData={flaskData} />
      <Footer />
    </Providers>
  );
}

export default App;
