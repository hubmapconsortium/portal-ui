import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { Publication } from 'js/components/publications/hooks';
import PublicationPanel from 'js/components/publications/PublicationsPanelItem';
import { skeletons } from 'js/shared-styles/panels/ResponsivePanelCells';

export default function PublicationsPanelList({
  publications,
  isLoading,
}: {
  publications: Publication[];
  isLoading: boolean;
}) {
  const panelsProps: PanelProps[] = useMemo(() => {
    if (!publications.length) {
      if (isLoading) return skeletons;
      return [
        {
          children: <Typography>No results found. Try searching for a different publication.</Typography>,
          key: 'no-results',
        },
      ];
    }
    const propsList: PanelProps[] = [
      {
        key: 'header',
        noPadding: true,
        children: <PublicationPanel.Header />,
      },
      ...publications.map(({ uuid, title, contributors, publication_date, publication_venue }) => ({
        key: uuid,
        noPadding: true,
        noHover: false,
        children: (
          <PublicationPanel.Item
            title={title}
            href={`/browse/publication/${uuid}`}
            contributors={contributors}
            publicationVenue={publication_venue}
            publishedDate={publication_date}
          />
        ),
      })),
    ];
    return propsList;
  }, [publications, isLoading]);

  return <PanelList panelsProps={panelsProps} />;
}
