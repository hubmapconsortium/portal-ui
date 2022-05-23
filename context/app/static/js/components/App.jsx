import React from 'react';
import marked from 'marked';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

import { StyledAlert, FlexContainer } from './style';

// Importing Search styles here so the CSS import order is correct.
import 'js/components/searchPage/Search.scss';

function App(props) {
  const { flaskData, groupsToken, isAuthenticated, userEmail } = props;
  const { endpoints, globalAlertMd } = flaskData;
  delete flaskData.endpoints;
  delete flaskData.globalAlertMd;

  return (
    <Providers endpoints={endpoints} groupsToken={groupsToken} isAuthenticated={isAuthenticated} userEmail={userEmail}>
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
