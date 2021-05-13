import React, { lazy } from 'react';
import PropTypes from 'prop-types';

import Error from 'js/pages/Error';
import Route from './Route';
import useSendPageView from './useSendPageView';
import useSetUrlBeforeLogin from './useSetUrlBeforeLogin';

const Donor = lazy(() => import('js/pages/Donor'));
const Dataset = lazy(() => import('js/pages/Dataset'));
const Sample = lazy(() => import('js/pages/Sample'));
const Collection = lazy(() => import('js/pages/Collection'));
const Home = lazy(() => import('js/pages/Home/Home'));
const Search = lazy(() => import('js/pages/search/Search'));
const DevSearch = lazy(() => import('js/pages/search/DevSearch'));
const Preview = lazy(() => import('js/pages/Preview'));
const Services = lazy(() => import('js/pages/Services'));
const Collections = lazy(() => import('js/pages/Collections'));
const CellsAPIDemo = lazy(() => import('js/pages/CellsAPIDemo'));
const Markdown = lazy(() => import('js/components/Markdown'));
const SavedLists = lazy(() => import('js/pages/SavedLists'));
const SavedList = lazy(() => import('js/pages/SavedList'));

function Routes(props) {
  const { flaskData } = props;
  const { entity, vitessce_conf, title, markdown, errorCode, list_uuid } = flaskData;
  const urlPath = window.location.pathname;
  const url = window.location.href;

  useSendPageView(urlPath);
  useSetUrlBeforeLogin(url);

  if (errorCode !== undefined) {
    // eslint-disable-next-line no-undef
    return <Error errorCode={errorCode} urlPath={urlPath} isAuthenticated={isAuthenticated} />;
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

  if (urlPath.startsWith('/browse/dataset/') || urlPath.startsWith('/browse/support/')) {
    return (
      <Route>
        <Dataset assayMetadata={entity} vitData={vitessce_conf} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/collection/')) {
    return (
      <Route>
        <Collection collection={entity} />
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
        <Services />
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

  if (urlPath === '/cells') {
    return (
      <Route>
        <CellsAPIDemo />
      </Route>
    );
  }

  if (urlPath === '/my-lists') {
    return (
      <Route>
        <SavedLists />
      </Route>
    );
  }

  if (urlPath.startsWith('/my-lists/')) {
    return (
      <Route>
        <SavedList listUUID={list_uuid} />
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
    list_uuid: PropTypes.string,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
