import React from 'react';
import ReactGA from 'react-ga';

import PropTypes from 'prop-types';
import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

function App(props) {
  const {
    flaskData,
    flaskData: { endpoints },
  } = props;
  ReactGA.initialize('UA-133341631-3');

  return (
    <Providers endpoints={endpoints}>
      <Header />
      <div className="main-content">
        <Routes flaskData={flaskData} />
      </div>
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
  }),
};

App.defaultProps = {
  flaskData: {},
};

export default App;
