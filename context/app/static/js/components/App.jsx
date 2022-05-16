import React from 'react';
import ReactGA from 'react-ga'; // TODO: Remove all react-ga references
// when Matomo is up: https://github.com/hubmapconsortium/portal-ui/issues/2636
import marked from 'marked';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

import { StyledAlert, FlexContainer } from './style';

// Importing Search styles here so the CSS import order is correct.
import 'js/components/searchPage/Search.scss';

function App(props) {
  const { flaskData, groupsToken, isAuthenticated } = props;
  const { endpoints, globalAlertMd } = flaskData;
  delete flaskData.endpoints;
  delete flaskData.globalAlertMd;
  ReactGA.initialize('UA-133341631-3');

  return (
    <Providers endpoints={endpoints} groupsToken={groupsToken}>
      <Header />
      {globalAlertMd && (
        <FlexContainer>
          <StyledAlert severity="warning">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: marked.parseInline(globalAlertMd) }} />
          </StyledAlert>
        </FlexContainer>
      )}
      <Routes flaskData={flaskData} isAuthenticated={isAuthenticated} />
      <Footer />
    </Providers>
  );
}

export default App;
