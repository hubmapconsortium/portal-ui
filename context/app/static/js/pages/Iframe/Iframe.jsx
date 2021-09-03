import React from 'react';

import Providers from 'js/components/Providers';
import EntityCounts from 'js/components/home/EntityCounts';
import AssayTypeBarChartContainer from 'js/components/home/AssayTypeBarChartContainer';

function Switch() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/iframe/entity-counts':
      return <EntityCounts />;
    case '/iframe/assay-barchart':
      return <AssayTypeBarChartContainer />;
    default:
      console.error('No such iframe');
      return 'ERROR: No such iframe';
  }
}

function Iframe(props) {
  const { flaskData } = props;
  return (
    <Providers endpoints={flaskData.endpoints}>
      <base target="_parent" /> {/* Set base to make sure links load in the parent of the iframe. */}
      <Switch />
    </Providers>
  );
}

export default Iframe;
