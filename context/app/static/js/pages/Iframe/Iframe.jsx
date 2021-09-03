import React from 'react';

import Providers from 'js/components/Providers';
import EntityCounts from 'js/components/home/EntityCounts';

function Switch() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/iframe/entity-counts':
      return <EntityCounts />;
    case '/iframe/assay-barchart':
      return 'TODO: assay-barchart';
    default:
      console.error('No such iframe');
      return 'ERROR: No such iframe';
  }
}

function Iframe(props) {
  const { flaskData } = props;
  return (
    <Providers endpoints={flaskData.endpoints}>
      <Switch />
    </Providers>
  );
}

export default Iframe;
