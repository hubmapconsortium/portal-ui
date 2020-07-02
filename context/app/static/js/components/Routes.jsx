import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { Home } from './Home';
import Search from './Search/Search';
import { Donor, Sample, Dataset, Collection } from './Detail';
import Showcase from './Showcase';
import { Collections } from './Collections';
import Markdown from './Markdown';

function Routes(props) {
  const { flaskData } = props;
  const { entity, vitessce_conf, endpoints, title, markdown, collection } = flaskData;
  const urlPath = window.location.pathname;

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <Container maxWidth="lg">
        <Donor assayMetadata={entity} vitData={vitessce_conf} entityEndpoint={endpoints.entityEndpoint} />
      </Container>
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <Container maxWidth="lg">
        <Sample assayMetadata={entity} vitData={vitessce_conf} entityEndpoint={endpoints.entityEndpoint} />
      </Container>
    );
  }

  if (urlPath.startsWith('/browse/dataset/')) {
    return (
      <Container maxWidth="lg">
        <Dataset
          assayMetadata={entity}
          vitData={vitessce_conf}
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

  if (urlPath === '/collections') {
    return (
      <Container maxWidth="lg">
        <Collections entityEndpoint={endpoints.entityEndpoint} />
      </Container>
    );
  }

  if (urlPath.startsWith('/browse/collection/')) {
    return (
      <Container maxWidth="lg">
        <Collection entityEndpoint={endpoints.entityEndpoint} collection={collection} />
      </Container>
    );
  }

  if ('markdown' in flaskData) {
    return (
      <Container maxWidth="lg">
        <Markdown markdown={markdown} />
      </Container>
    );
  }
}

Routes.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
    markdown: PropTypes.string,
    collection: PropTypes.object,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
