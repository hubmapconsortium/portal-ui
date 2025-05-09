import React, { useState } from 'react';
import Stack from '@mui/material/Stack';

import { StyledTabPanel, StyledTabs } from 'js/components/publications/style';
import Tab from 'js/shared-styles/tabs/Tab';
import { usePublications } from 'js/components/publications/hooks';
import PublicationsPanelList from 'js/components/publications/PublicationsPanelList';

function PublicationsTabs() {
  const { filteredPublications, isLoading } = usePublications();

  const preprints = filteredPublications.filter((pub) => pub.status.toLowerCase() === 'preprint');
  const reviewed = filteredPublications.filter((pub) => pub.status.toLowerCase() === 'published');

  const publicationsByStatus = [
    { status: 'Peer-Reviewed', relevantPublications: reviewed },
    { status: 'Preprint', relevantPublications: preprints },
  ];

  const [openTabIndex, setOpenTabIndex] = useState(0);
  const handleChange = (_: Event, newIndex: number) => {
    setOpenTabIndex(newIndex);
  };

  return (
    <Stack overflow="auto">
      <StyledTabs
        data-testid="publication-tabs"
        value={openTabIndex}
        onChange={handleChange}
        aria-label="Published and preprint publications"
      >
        {publicationsByStatus.map(({ status, relevantPublications }, i) => {
          const count = relevantPublications.length;
          return (
            <Tab
              data-testid={`publication-tab-${status}`}
              label={`${status} (${count})`}
              index={i}
              key={status}
              disabled={count === 0}
            />
          );
        })}
      </StyledTabs>
      {publicationsByStatus.map(({ status, relevantPublications }, i) => (
        <StyledTabPanel value={openTabIndex} index={i} key={status}>
          <PublicationsPanelList publications={relevantPublications} isLoading={isLoading} />
        </StyledTabPanel>
      ))}
    </Stack>
  );
}

export default PublicationsTabs;
