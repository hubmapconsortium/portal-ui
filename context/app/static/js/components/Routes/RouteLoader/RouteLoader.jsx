import React from 'react';
import { useTransition, animated, config } from 'react-spring';
import CircularProgress from '@material-ui/core/CircularProgress';

import { LoadingWrapper } from './style';

const AnimatedCircularProgress = animated(CircularProgress);

const transitionConfig = {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  config: config.slow,
};

function RouteLoader() {
  const transitions = useTransition(true, transitionConfig);
  return (
    <LoadingWrapper>
      {transitions((style) => (
        <AnimatedCircularProgress style={style} />
      ))}
    </LoadingWrapper>
  );
}

export default RouteLoader;
