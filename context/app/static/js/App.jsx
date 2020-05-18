import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

function App(props) {
  const { flaskData } = props;
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <div className="main-content">
          <Routes flaskData={flaskData} />
        </div>
        <Footer />
      </ThemeProvider>
    </StylesProvider>
  );
}

App.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    provenance: PropTypes.object,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

App.defaultProps = {
  flaskData: {},
};

export default App;
