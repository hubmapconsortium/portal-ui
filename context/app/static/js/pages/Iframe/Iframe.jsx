import React, { lazy, Suspense } from 'react';

import Providers from 'js/components/Providers';

const EntityCounts = lazy(() => import('js/components/home/EntityCounts'));
const HuBMAPDatasetsChart = lazy(() => import('js/components/home/HuBMAPDatasetsChart'));

function Switch({ organs_count }) {
  const { pathname } = window.location;
  const params = new URLSearchParams(window.location.search);
  const iri = params.get('iri');

  switch (pathname) {
    case '/iframe/entity-counts':
      return <EntityCounts organsCount={organs_count} />;
    case '/iframe/assay-barchart':
      return <HuBMAPDatasetsChart />;
    case '/iframe/organ':
      return (
        <ccf-organ-info organ-iri={iri} data-sources='["https://apps.humanatlas.io/api/ds-graph/hubmap?token="]' />
      );
    default:
      throw new Error(`No iframe ${pathname}`);
  }
}

function Iframe({ flaskData: { endpoints, organs_count } }) {
  return (
    <Providers endpoints={endpoints}>
      <base target="_parent" />
      {/* Set base to make sure links load in the parent of the iframe. */}
      <Suspense fallback={null}>
        {/* Required by lazy(), but we don't really need a please-wait. */}
        <Switch organs_count={organs_count} />
      </Suspense>
    </Providers>
  );
}

export default Iframe;
