import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import marked from 'marked';

import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

import { StyledAlert, FlexContainer } from './style';

// Importing Search styles here so the CSS import order is correct.
import 'js/components/Search/Search.scss';

function App(props) {
  const { flaskData } = props;
  const {
    title,
    entity,
    vitessce_conf,
    endpoints,
    markdown,
    collection,
    errorCode,
    list_uuid,
    has_notebook,
    globalAlertMd,
    vis_lifted_uuid,
  } = flaskData;
  ReactGA.initialize('UA-133341631-3');

  return (
    // eslint-disable-next-line no-undef
    <Providers endpoints={endpoints} nexusToken={nexus_token}>
      <Header />
      {globalAlertMd && (
        <FlexContainer>
          <StyledAlert severity="warning">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: marked.parseInline(globalAlertMd) }} />
          </StyledAlert>
        </FlexContainer>
      )}
      <Routes
        flaskData={{
          title,
          entity,
          vitessce_conf,
          markdown,
          collection,
          errorCode,
          list_uuid,
          has_notebook,
          vis_lifted_uuid,
        }}
      />
      <Footer />
    </Providers>
  );
}

App.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    vitessce_conf: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    endpoints: PropTypes.object,
    markdown: PropTypes.string,
    collection: PropTypes.object,
    errorCode: PropTypes.number,
    list_uuid: PropTypes.string,
    globalAlertMd: PropTypes.string,
    has_notebook: PropTypes.bool,
    vis_lifted_uuid: PropTypes.string,
  }),
};

App.defaultProps = {
  flaskData: {},
};

export default App;
