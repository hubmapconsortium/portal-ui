import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import CircularProgress from '@mui/material/CircularProgress';

import { LoadingWrapper } from './style';

const AnimatedCircularProgress = animated(CircularProgress);

function RouteLoader() {
  const styles = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.slow,
  }));
  return (
    <LoadingWrapper>
      <AnimatedCircularProgress style={styles} />
    </LoadingWrapper>
  );
}

export default RouteLoader;
