/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import Details from './components/Details';
import NoticeAlert from './components/NoticeAlert';
import Footer from './Footer';
import Header from './Header';


function App(props) {
  const { flaskData } = props;
  const {
    flashed_messages, entity, provenance, vitessce_conf,
  } = flaskData;

  const getComponentView = () => {
    // Temp routing solution for showing the correct react component.
    if (window.location.pathname.indexOf('browse/') > -1) {
      return (
        <span>
          {flashed_messages && flashed_messages.length
            ? <NoticeAlert errors={flashed_messages} /> : null}
          <Details
            assayMetaData={entity}
            provData={provenance}
            vitData={vitessce_conf}
          />
        </span>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div className="main-content">
        {getComponentView()}
      </div>
      <Footer />
    </ThemeProvider>
  );
}

App.propTypes = {
  flaskData: PropTypes.exact({
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    provenance: PropTypes.object,
    vitessce_conf: PropTypes.object,
  }).isRequired,
};

export default App;
