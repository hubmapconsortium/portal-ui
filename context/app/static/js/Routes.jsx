/* eslint-disable camelcase */
import React from 'react';
import NoticeAlert from './components/NoticeAlert';
import Details from './components/Details';
import Home from './components/Home';

function Routes(props) {
  const { flaskData } = props;
  const {
    flashed_messages, entity, provenance, vitessce_conf,
  } = flaskData;
  const path = window.location.pathname;

  if (path.indexOf('browse/') > -1) {
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

  if (path === '/') {
    return (
      <Home />
    );
  }
}

export default Routes;
