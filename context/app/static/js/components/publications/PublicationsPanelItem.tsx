import React from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import { buildSecondaryText } from 'js/components/publications/utils';
import { ContributorAPIResponse, normalizeContributor } from 'js/components/detailPage/ContributorsTable/utils';

const desktopConfig = {
  title: {
    flexBasis: '90%',
    flexGrow: 1,
  },
  publishedDate: {
    flexBasis: '10%',
    flexGrow: 1,
  },
};

function PublicationHeaderPanel() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={1} position="sticky" top={0} zIndex={1}>
      <HeaderCell {...desktopConfig.title}>Title</HeaderCell>
      <HeaderCell {...desktopConfig.publishedDate}>Published Date</HeaderCell>
    </StackTemplate>
  );
}

interface PublicationPanelItemProps {
  title: string;
  publishedDate: string;
  publicationVenue: string;
  href: string;
  contributors?: ContributorAPIResponse[];
}

function PublicationPanelItem({
  title,
  publishedDate,
  publicationVenue,
  href,
  contributors,
}: PublicationPanelItemProps) {
  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.title} aria-label="Title">
        <Stack>
          <InternalLink href={href} data-testId="panel-title">
            <Typography>{title}</Typography>
          </InternalLink>
          <Typography>{buildSecondaryText(publicationVenue, contributors?.map(normalizeContributor))}</Typography>
        </Stack>
      </BodyCell>
      <BodyCell {...desktopConfig.publishedDate} aria-label="Publication Date">
        <Typography>{publishedDate}</Typography>
      </BodyCell>
    </StackTemplate>
  );
}

const PublicationPanel = {
  Header: PublicationHeaderPanel,
  Item: PublicationPanelItem,
};

export default PublicationPanel;
