import React, { lazy, Suspense } from 'react';

import Providers from 'js/components/Providers';

const EntityCounts = lazy(() => import('js/components/home/EntityCounts'));
const HuBMAPDatasetsChart = lazy(() => import('js/components/home/HuBMAPDatasetsChart'));

function Switch() {
  const { pathname } = window.location;
  const params = new URLSearchParams(window.location.search);
  const iri = params.get('iri');

  switch (pathname) {
    case '/iframe/entity-counts':
      return <EntityCounts />;
    case '/iframe/assay-barchart':
      return <HuBMAPDatasetsChart />;
    case '/iframe/organ':
      return <ccf-organ-info organ-iri={iri} use-remote-api="true" />;
    default:
      throw new Error(`No iframe ${pathname}`);
  }
}

function Iframe(props) {
  const { flaskData } = props;
  return (
    <Providers endpoints={flaskData.endpoints}>
      <base target="_parent" />
      {/* Set base to make sure links load in the parent of the iframe. */}
      <Suspense fallback={null}>
        {/* Required by lazy(), but we don't really need a please-wait. */}
        <Switch />
      </Suspense>
    </Providers>
  );
}

export default Iframe;
