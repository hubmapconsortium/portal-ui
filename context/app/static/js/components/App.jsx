import React from 'react';
import PropTypes from 'prop-types';
import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import { Header } from './Header';

function App(props) {
  const { flaskData } = props;
  return (
    <Providers>
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
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
    collection: PropTypes.object,
  }),
};

App.defaultProps = {
  flaskData: {},
};

export default App;
