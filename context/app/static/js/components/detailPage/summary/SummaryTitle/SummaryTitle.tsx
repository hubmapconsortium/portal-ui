import React, { PropsWithChildren, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useInView } from 'react-intersection-observer';

import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';

const entityStoreSelector = (state: EntityStore) => state.setSummaryComponentObserver;

interface SummaryTitleProps extends PropsWithChildren {
  iconTooltipText?: string;
  entityIcon?: keyof typeof entityIconMap;
  organIcon?: string; // name of the organ to fetch icon for (e.g. 'Kidney', 'Lung', etc.
}

const titleLinks: Record<AllEntityTypes, string | undefined> = {
  Donor: '/search/donors',
  Sample: '/search/samples',
  Dataset: '/search/datasets',
  Support: '/search/datasets',
  Publication: '/publications',
  Collection: '/collections',
  Workspace: '/workspaces',
  WorkspaceTemplate: '/workspaces',
  CellType: '/cell-types',
  Gene: '/genes',
  VerifiedUser: undefined,
};

const useSummaryHref = (entityIcon?: keyof typeof entityIconMap, organIcon?: string) => {
  if (organIcon) {
    return '/organs';
  }
  if (entityIcon) {
    return titleLinks[entityIcon];
  }
  return undefined;
};

function SummaryTitle({ children, iconTooltipText, entityIcon, organIcon }: SummaryTitleProps) {
  const setSummaryComponentObserver = useEntityStore(entityStoreSelector);

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
  });

  const Icon = entityIcon ? entityIconMap[entityIcon] : null;

  useEffect(() => {
    if (entry) {
      setSummaryComponentObserver(inView, entry);
    }
  }, [setSummaryComponentObserver, entry, inView]);

  const href = useSummaryHref(entityIcon, organIcon);
  const component = href ? 'a' : 'div';

  return (
    <Stack direction="row" alignItems="center" gap={1} component={component} href={href}>
      {Icon && <Icon color="primary" />}
      {organIcon && <OrganIcon organName={organIcon} color="primary" />}
      <Typography variant="subtitle1" color="primary" ref={ref} component="h1">
        {children}
      </Typography>
      <InfoTooltipIcon iconTooltipText={iconTooltipText} />
    </Stack>
  );
}

export default SummaryTitle;
