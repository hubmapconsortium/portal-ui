import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Providers from './Providers';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

function App(props) {
  const { flaskData } = props;
  return (
    <Providers>
      <Header />
      <div className="main-content">
        <Container maxWidth="lg">
          <Routes flaskData={flaskData} />
        </Container>
      </div>
      <Footer />
    </Providers>
  );
}

App.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

App.defaultProps = {
  flaskData: {},
};

export default App;
