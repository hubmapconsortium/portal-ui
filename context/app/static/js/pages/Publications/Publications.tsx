import React from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import { usePublications } from 'js/components/publications/hooks';
import PublicationsSearchProvider from 'js/components/publications/PublicationsSearchContext';
import PublicationsSearchBar from 'js/components/publications/PublicationsSearchBar';
import PublicationsTabs from 'js/components/publications/PublicationsTabs';

const text = {
  title: 'Publications',
  description: (
    <>
      Browse peer-reviewed publications and preprints that use HuBMAP datasets for single-cell and spatial biology
      research. A full list of HuBMAP-funded studies is available on{' '}
      <InternalLink href="https://scholar.google.com/citations?user=CtGSN80AAAAJ&hl=en">Google Scholar</InternalLink>.
    </>
  ),
  sectionTitle: 'Publications with HuBMAP Data',
  sectionDescription:
    'Explore peer-reviewed publications and preprints that uses HuBMAP datasets. This table is available for download in TSV format. Publication pages have a summary of publication-related information, a list of referenced HuBMAP datasets and vignettes of relevant visualizations.',
};

function Publications() {
  const { publications, isLoading } = usePublications();

  return (
    <PublicationsSearchProvider>
      <PanelListLandingPage
        title={text.title}
        subtitle={publications.length > 0 ? `${publications.length} Publications` : undefined}
        description={text.description}
        sectionTitle={text.sectionTitle}
        sectionDescription={text.sectionDescription}
        data-testid="publications-title"
      >
        <PublicationsSearchBar />
        <PublicationsTabs publications={publications} isLoading={isLoading} />
      </PanelListLandingPage>
    </PublicationsSearchProvider>
  );
}

export default Publications;
