import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { Home } from './Home';
import Search from './Search/Search';
import Donor from './Detail/Donor';
import Sample from './Detail/Sample';
import Dataset from './Detail/Dataset';
import Showcase from './Showcase';

function Routes(props) {
  const { flaskData } = props;
  const { flashed_messages, entity, vitessce_conf, endpoints, title } = flaskData;
  const urlPath = window.location.pathname;

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <Container maxWidth="lg">
        <Donor
          assayMetadata={entity}
          vitData={vitessce_conf}
          flashed_messages={flashed_messages}
          entityEndpoint={endpoints.entityEndpoint}
        />
      </Container>
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <Container maxWidth="lg">
        <Sample
          assayMetadata={entity}
          vitData={vitessce_conf}
          flashed_messages={flashed_messages}
          entityEndpoint={endpoints.entityEndpoint}
        />
      </Container>
    );
  }

  if (urlPath.startsWith('/browse/dataset/')) {
    return (
      <Container maxWidth="lg">
        <Dataset
          assayMetadata={entity}
          vitData={vitessce_conf}
          flashed_messages={flashed_messages}
          assetsEndpoint={endpoints.assetsEndpoint}
          entityEndpoint={endpoints.entityEndpoint}
        />
      </Container>
    );
  }

  if (urlPath === '/') {
    return <Home elasticsearchEndpoint={endpoints.elasticsearchEndpoint} />;
  }

  if (urlPath.startsWith('/search')) {
    return (
      <Container maxWidth="lg">
        <Search elasticsearchEndpoint={endpoints.elasticsearchEndpoint} title={title} />
      </Container>
    );
  }

  if (urlPath.startsWith('/showcase')) {
    return <Showcase title={title} vitData={vitessce_conf} assayMetadata={entity} />;
  }
}

Routes.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
