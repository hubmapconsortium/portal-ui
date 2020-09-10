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
import useSetUrlPathAndSearchBeforeLogin from './useSetUrlPathAndSearchBeforeLogin';

function Routes(props) {
  const { flaskData } = props;
  const { entity, vitessce_conf, title, markdown, collection, errorCode } = flaskData;
  const urlPath = window.location.pathname;
  const pathAndSearch = (window.location.pathname + window.location.search).substr(1);

  useSendPageView(urlPath);
  useSetUrlPathAndSearchBeforeLogin(pathAndSearch);

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
