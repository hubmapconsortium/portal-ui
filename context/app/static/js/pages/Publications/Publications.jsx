import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { useSearchHits } from 'js/hooks/useSearchData';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import { buildPublicationsPanelsProps } from './utils';

export const getAllPublicationsQuery = {
  post_filter: { term: { 'entity_type.keyword': 'Publication' } },
  size: 10000,
};

const Description = () => (
  <>
    The following publications are a partial list of published HuBMAP research that uses data available through the
    HuBMAP Data Portal. The full list of HuBMAP-funded publications is available on{' '}
    <LightBlueLink href="https://scholar.google.com/citations?user=CtGSN80AAAAJ&hl=en">Google Scholar</LightBlueLink>.
    Publication pages will have a summary of publication-related information, a list of referenced HuBMAP datasets and
    vignettes of relevant visualizations.
  </>
);

function Publications() {
  const { searchHits: publications } = useSearchHits(getAllPublicationsQuery);

  const panelsProps = buildPublicationsPanelsProps(publications);

  return (
    <PanelListLandingPage
      title="Publications"
      subtitle={panelsProps.length > 0 && `${panelsProps.length} Publications`}
      description={<Description />}
      panelsProps={panelsProps}
    />
  );
}

export default Publications;
