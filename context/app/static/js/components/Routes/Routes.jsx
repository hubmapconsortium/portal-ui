import React from 'react';
import PropTypes from 'prop-types';

import Error from 'js/pages/Error';
import Route from './Route';
import { Home } from '../Home';
import Search from '../Search/Search';
import DevSearch from '../Search/DevSearch';
import { Donor, Sample, Dataset, Collection } from '../Detail';
import Preview from '../Preview';
import { Collections } from '../Collections';
import Markdown from '../Markdown';
import useSendPageView from './useSendPageView';

function Routes(props) {
  const { flaskData } = props;
  const { entity, vitessce_conf, endpoints, title, markdown, collection, errorCode } = flaskData;
  const urlPath = window.location.pathname;

  useSendPageView(urlPath);

  if (errorCode !== undefined) {
    // eslint-disable-next-line no-undef
    return <Error errorCode={errorCode} isAuthenticated={isAuthenticated} />;
  }

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <Route mt constrainWidth>
        <Donor
          assayMetadata={entity}
          vitData={vitessce_conf}
          entityEndpoint={endpoints.entityEndpoint}
          elasticsearchEndpoint={endpoints.elasticsearchEndpoint}
        />
      </Route>
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <Route mt constrainWidth>
        <Sample
          assayMetadata={entity}
          vitData={vitessce_conf}
          entityEndpoint={endpoints.entityEndpoint}
          elasticsearchEndpoint={endpoints.elasticsearchEndpoint}
        />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/dataset/')) {
    return (
      <Route mt constrainWidth>
        <Dataset
          assayMetadata={entity}
          vitData={vitessce_conf}
          assetsEndpoint={endpoints.assetsEndpoint}
          entityEndpoint={endpoints.entityEndpoint}
          elasticsearchEndpoint={endpoints.elasticsearchEndpoint}
        />
      </Route>
    );
  }

  if (urlPath === '/') {
    return (
      <Route mt>
        <Home elasticsearchEndpoint={endpoints.elasticsearchEndpoint} />
      </Route>
    );
  }

  /* eslint-disable no-undef */
  if (urlPath.startsWith('/search')) {
    return (
      <Route mt constrainWidth>
        <Search elasticsearchEndpoint={endpoints.elasticsearchEndpoint} title={title} nexusToken={nexus_token} />
      </Route>
    );
  }

  if (urlPath.startsWith('/dev-search')) {
    return (
      <Route mt constrainWidth>
        <DevSearch elasticsearchEndpoint={endpoints.elasticsearchEndpoint} nexusToken={nexus_token} />
      </Route>
    );
  }
  /* eslint-enable no-undef */

  if (urlPath.startsWith('/preview')) {
    return (
      <Route mt constrainWidth>
        <Preview title={title} vitData={vitessce_conf} assayMetadata={entity} markdown={markdown} />
      </Route>
    );
  }

  if (urlPath === '/collections') {
    return (
      <Route mt constrainWidth>
        <Collections entityEndpoint={endpoints.entityEndpoint} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/collection/')) {
    return (
      <Route mt constrainWidth>
        <Collection entityEndpoint={endpoints.entityEndpoint} collection={collection} />
      </Route>
    );
  }

  if (urlPath === '/client-side-error') {
    throw Error('Intentional client-side-error');
  }

  if ('markdown' in flaskData) {
    return (
      <Route mt constrainWidth>
        <Markdown markdown={markdown} />
      </Route>
    );
  }
}

Routes.propTypes = {
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

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
