import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useInView } from 'react-intersection-observer';

import useEntityStore from 'js/stores/useEntityStore';

const entityStoreSelector = (state) => state.setSummaryComponentObserver;

function SummaryTitle({ children }) {
  const setSummaryComponentObserver = useEntityStore(entityStoreSelector);

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
  });

  useEffect(() => {
    if (entry) {
      setSummaryComponentObserver(inView, entry);
    }
  }, [setSummaryComponentObserver, entry, inView]);

  return (
    <Typography variant="subtitle1" component="h1" color="primary" ref={ref}>
      {children}
    </Typography>
  );
}

export default SummaryTitle;
