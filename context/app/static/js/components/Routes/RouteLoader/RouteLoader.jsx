import React from 'react';
import { useTransition, animated, config } from 'react-spring';
import CircularProgress from '@mui/material/CircularProgress';

import { LoadingWrapper } from './style';

const AnimatedCircularProgress = animated(CircularProgress);

const transitionConfig = {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  config: config.slow,
};

function RouteLoader() {
  const transitions = useTransition(true, null, transitionConfig);
  return (
    <LoadingWrapper>
      {transitions.map(({ key, props }) => (
        <AnimatedCircularProgress key={key} style={props} />
      ))}
    </LoadingWrapper>
  );
}

export default RouteLoader;
