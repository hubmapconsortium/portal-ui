import React, { PropsWithChildren, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useInView } from 'react-intersection-observer';

import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { AllEntityTypes, entityIconMap, hasIconForEntity } from 'js/shared-styles/icons/entityIconMap';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { ChevronLeftRounded } from '@mui/icons-material';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

const entityStoreSelector = (state: EntityStore) => state.setSummaryComponentObserver;

interface SummaryTitleProps extends PropsWithChildren {
  iconTooltipText?: string;
  entityIcon?: keyof typeof entityIconMap;
  organIcon?: string; // name of the organ to fetch icon for (e.g. 'Kidney', 'Lung', etc.
  /**
   * The entity type is the page's h1 only when the page title isn't human-readable (a HuBMAP ID).
   * Pages whose title is a name make that the h1 and render this as a plain label.
   */
  component?: 'h1' | 'p';
  /** Applied to the entity type text. */
  'data-testid'?: string;
}

const titleLinks: Record<AllEntityTypes, string | undefined> = {
  Donor: '/search/donors',
  Sample: '/search/samples',
  Dataset: '/search/datasets',
  Support: '/search/datasets',
  Publication: '/publications',
  Collection: '/collections',
  Workspace: '/workspaces',
  WorkspaceTemplate: '/templates',
  CellType: '/cell-types',
  Gene: '/biomarkers',
  VerifiedUser: undefined,
  Tutorial: '/tutorials',
  File: '/search/files',
};

const titleLinkNames: Record<AllEntityTypes, string | undefined> = {
  Donor: 'Donor Search',
  Sample: 'Sample Search',
  Dataset: 'Dataset Search',
  Support: 'Dataset Search',
  Publication: 'Publications',
  Collection: 'Collections',
  Workspace: 'Workspaces',
  WorkspaceTemplate: 'Workspace Templates',
  CellType: 'Cell Types',
  Gene: 'Biomarkers',
  VerifiedUser: undefined,
  Tutorial: 'Tutorials',
  File: 'Files Search',
};

const getTitleLinkTooltipText = (entityType?: AllEntityTypes, organIcon?: string) => {
  if (organIcon) {
    return 'Organs';
  }
  if (!entityType || !titleLinkNames[entityType]) {
    return undefined;
  }
  return titleLinkNames[entityType];
};

const getSummaryHref = (entityIcon?: keyof typeof entityIconMap, organIcon?: string) => {
  if (organIcon) {
    return '/organs';
  }
  if (entityIcon) {
    return titleLinks[entityIcon];
  }
  return undefined;
};

function SummaryTitle({
  children,
  iconTooltipText,
  entityIcon,
  organIcon,
  component = 'h1',
  'data-testid': testId,
}: SummaryTitleProps) {
  const setSummaryComponentObserver = useEntityStore(entityStoreSelector);

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
  });

  const Icon = hasIconForEntity(entityIcon) ? entityIconMap[entityIcon] : null;

  useEffect(() => {
    if (entry) {
      setSummaryComponentObserver(inView, entry);
    }
  }, [setSummaryComponentObserver, entry, inView]);

  const href = getSummaryHref(entityIcon, organIcon);
  const tooltipText = getTitleLinkTooltipText(entityIcon, organIcon);
  const containerComponent = href ? 'a' : 'div';

  const summaryTitle = (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      component={containerComponent}
      href={href}
      maxWidth="fit-content"
    >
      {Icon && <Icon color="primary" />}
      {organIcon && <OrganIcon organName={organIcon} color="primary" />}
      {href && tooltipText ? (
        <>
          <Typography variant="subtitle1" color="primary" component="span" display="inline-block">
            {tooltipText}
          </Typography>
          <ChevronLeftRounded fontSize="small" />
        </>
      ) : null}
      <Typography variant="subtitle1" color="primary" ref={ref} component={component} data-testid={testId}>
        {children}
      </Typography>
      <InfoTooltipIcon iconTooltipText={iconTooltipText} />
    </Stack>
  );

  if (!tooltipText || !href) {
    return summaryTitle;
  }

  return (
    <SecondaryBackgroundTooltip placement="top" title={`Go to ${tooltipText}`}>
      {summaryTitle}
    </SecondaryBackgroundTooltip>
  );
}

export default SummaryTitle;
