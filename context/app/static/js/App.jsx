import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';


function App(props) {
  const { flaskData = {} } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div className="main-content">
        <Routes flaskData={flaskData} />
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
