/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Home from './Home';
import Search from './Search/Search';
import Donor from './Detail/Donor';
import Sample from './Detail/Sample';
import Dataset from './Detail/Dataset';
import Showcase from './Showcase/Showcase';

function Routes(props) {
  const { flaskData } = props;
  const { entity, vitessce_conf, endpoints, title } = flaskData;
  const urlPath = window.location.pathname;

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <Donor
        assayMetadata={entity}
        vitData={vitessce_conf}
        entityEndpoint={endpoints.entityEndpoint}
      />
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <Sample
        assayMetadata={entity}
        vitData={vitessce_conf}
        entityEndpoint={endpoints.entityEndpoint}
      />
    );
  }

  if (urlPath.startsWith('/browse/dataset/')) {
    return (
      <Dataset
        assayMetadata={entity}
        vitData={vitessce_conf}
        assetsEndpoint={endpoints.assetsEndpoint}
        entityEndpoint={endpoints.entityEndpoint}
      />
    );
  }

  if (urlPath === '/') {
    return <Home />;
  }

  if (urlPath.startsWith('/search')) {
    return <Search elasticsearchEndpoint={endpoints.elasticsearchEndpoint} title={title} />;
  }

  if (urlPath.startsWith('/showcase')) {
    return <Showcase title={title} vitData={vitessce_conf} assayMetadata={entity} />;
  }
}

Routes.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
