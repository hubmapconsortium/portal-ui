import React, { PropsWithChildren, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useInView } from 'react-intersection-observer';

import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { Stack } from '@mui/material';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

const entityStoreSelector = (state: EntityStore) => state.setSummaryComponentObserver;

interface SummaryTitleProps extends PropsWithChildren {
  iconTooltipText?: string;
  entityIcon?: keyof typeof entityIconMap;
}

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

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {Icon && <Icon color="primary" />}
      <Typography variant="subtitle1" component="h1" color="primary" ref={ref}>
        {children}
      </Typography>
      <InfoTooltipIcon iconTooltipText={iconTooltipText} />
    </Stack>
  );
}

export default SummaryTitle;
