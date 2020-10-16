import React from 'react';
import PropTypes from 'prop-types';

import Donor from 'js/pages/Donor';
import Dataset from 'js/pages/Dataset';
import Sample from 'js/pages/Sample';
import Collection from 'js/pages/Collection';
import Error from 'js/pages/Error';
import Home from 'js/pages/Home';
import Search from 'js/pages/search/Search';
import DevSearch from 'js/pages/search/DevSearch';
import Preview from 'js/pages/Preview';
import ServiceStatus from 'js/pages/ServiceStatus';
import Collections from 'js/pages/Collections';
import Markdown from 'js/components/Markdown';
import Route from './Route';
import useSendPageView from './useSendPageView';
import useSetUrlBeforeLogin from './useSetUrlBeforeLogin';

function Routes(props) {
  const { flaskData } = props;
  const { entity, vitessce_conf, title, markdown, collection, errorCode } = flaskData;
  const urlPath = window.location.pathname;
  const url = window.location.href;

  useSendPageView(urlPath);
  useSetUrlBeforeLogin(url);

  if (errorCode !== undefined) {
    // eslint-disable-next-line no-undef
    return <Error errorCode={errorCode} isAuthenticated={isAuthenticated} />;
  }

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <Route>
        <Donor assayMetadata={entity} vitData={vitessce_conf} />
      </Route>
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <Route>
        <Sample assayMetadata={entity} vitData={vitessce_conf} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/dataset/')) {
    return (
      <Route>
        <Dataset assayMetadata={entity} vitData={vitessce_conf} />
      </Route>
    );
  }

  if (urlPath === '/') {
    return (
      <Route disableWidthConstraint>
        <Home />
      </Route>
    );
  }

  /* eslint-disable no-undef */
  if (urlPath.startsWith('/search')) {
    return (
      <Route>
        <Search title={title} />
      </Route>
    );
  }

  if (urlPath.startsWith('/dev-search')) {
    return (
      <Route>
        <DevSearch />
      </Route>
    );
  }
  /* eslint-enable no-undef */

  if (urlPath.startsWith('/preview')) {
    return (
      <Route>
        <Preview title={title} vitData={vitessce_conf} assayMetadata={entity} markdown={markdown} />
      </Route>
    );
  }

  if (urlPath === '/services') {
    return (
      <Route>
        <ServiceStatus />
      </Route>
    );
  }

  if (urlPath === '/collections') {
    return (
      <Route>
        <Collections />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/collection/')) {
    return (
      <Route>
        <Collection collection={collection} />
      </Route>
    );
  }

  if (urlPath === '/client-side-error') {
    throw Error('Intentional client-side-error');
  }

  if ('markdown' in flaskData) {
    return (
      <Route>
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
    markdown: PropTypes.string,
    collection: PropTypes.object,
    errorCode: PropTypes.number,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
