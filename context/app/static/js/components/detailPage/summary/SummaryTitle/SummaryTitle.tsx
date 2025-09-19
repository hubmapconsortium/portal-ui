import React, { PropsWithChildren, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useInView } from 'react-intersection-observer';

import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';

const entityStoreSelector = (state: EntityStore) => state.setSummaryComponentObserver;

interface SummaryTitleProps extends PropsWithChildren {
  iconTooltipText?: string;
  entityIcon?: keyof typeof entityIconMap;
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

function SummaryTitle({ children, iconTooltipText, entityIcon }: SummaryTitleProps) {
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

  const href = entityIcon ? titleLinks[entityIcon] : undefined;
  const component = href ? 'a' : 'div';

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {Icon && <Icon color="primary" />}
      <Typography variant="subtitle1" color="primary" ref={ref} href={href} component={component}>
        {children}
      </Typography>
      <InfoTooltipIcon iconTooltipText={iconTooltipText} />
    </Stack>
  );
}

export default SummaryTitle;
