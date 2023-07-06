/* eslint-disable no-underscore-dangle */
import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import { Tab } from 'js/shared-styles/tabs';
import { usePublications } from './hooks';

import { StyledTabs, StyledTabPanel } from './style';
import PublicationsPanelList from '../../components/publications/PublicationsPanelList/PublicationsPanelList';

function Description() {
  return (
    <>
      The following publications are a partial list of published HuBMAP research that uses data available through the
      HuBMAP Data Portal. The full list of HuBMAP-funded publications is available on{' '}
      <LightBlueLink href="https://scholar.google.com/citations?user=CtGSN80AAAAJ&hl=en">Google Scholar</LightBlueLink>.
      Publication pages will have a summary of publication-related information, a list of referenced HuBMAP datasets and
      vignettes of relevant visualizations.
    </>
  );
}

function Publications() {
  const {
    publicationsCounts: { statuses, publicationsCount = 0 },
    handleChange,
    openTabIndex,
  } = usePublications();

  const sortedPublicationStatusEntries = Object.entries(statuses).sort(([statusA], [statusB]) =>
    statusB.localeCompare(statusA),
  );

  return (
    <PanelListLandingPage
      title="Publications"
      subtitle={publicationsCount > 0 && `${publicationsCount} Publications`}
      description={<Description />}
    >
      <StyledTabs
        data-testid="publication-tabs"
        value={openTabIndex}
        onChange={handleChange}
        aria-label="Published and preprint publications"
      >
        {sortedPublicationStatusEntries.map(([, { category, id, count }], i) => {
          return (
            <Tab
              data-testid={`publication-tab-${id.toLowerCase()}`}
              label={`${category} (${count})`}
              index={i}
              key={category}
              disabled={count === 0}
            />
          );
        })}
      </StyledTabs>

      {sortedPublicationStatusEntries.map(([status, { category }], i) => (
        <StyledTabPanel value={openTabIndex} index={i} key={category}>
          <PublicationsPanelList status={status} />
        </StyledTabPanel>
      ))}
    </PanelListLandingPage>
  );
}

export default Publications;
