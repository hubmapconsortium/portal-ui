import React from 'react';
import styled from 'styled-components';
import { useTransition, animated, config } from 'react-spring';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

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
