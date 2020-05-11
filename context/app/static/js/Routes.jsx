/* eslint-disable camelcase */
import React from 'react';
import NoticeAlert from './components/NoticeAlert';
import Details from './components/Details';
import Home from './components/Home';
import Search from './components/Search/Search';

function Routes(props) {
  const { flaskData } = props;
  const {
    flashed_messages, entity, provenance, vitessce_conf,
  } = flaskData;
  const urlPath = window.location.pathname;

  if (urlPath.indexOf('/browse') > -1) {
    return (
      <>
        {flashed_messages && flashed_messages.length && <NoticeAlert errors={flashed_messages} />}
        <Details
          assayMetaData={entity}
          provData={provenance}
          vitData={vitessce_conf}
        />
      </>
    );
  }

  if (urlPath === '/') {
    return (
      <Home />
    );
  }

  if (urlPath.indexOf('/search') > -1) {
    return (
      <Search />
    );
  }
}

export default Routes;
