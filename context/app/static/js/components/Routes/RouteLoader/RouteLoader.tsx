import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import CircularProgress from '@mui/material/CircularProgress';

import { LoadingWrapper } from './style';

const AnimatedCircularProgress = animated(CircularProgress);

const transitionConfig = {
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: config.slow,
};

function RouteLoader() {
  const [styles] = useSpring(() => transitionConfig);
  return (
    <LoadingWrapper>
      <AnimatedCircularProgress style={styles} />
    </LoadingWrapper>
  );
}

export default RouteLoader;
