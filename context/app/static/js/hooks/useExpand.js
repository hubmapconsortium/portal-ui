import { useTransition, useSpring, config } from 'react-spring';
import useResizeObserver from 'use-resize-observer/polyfilled';

function useExpandTransition(ref, initialElementHeight, optionalConfig) {
  const { height = 0 } = useResizeObserver({ ref });

  return useTransition(true, {
    from: { opacity: 0, height: initialElementHeight, overflowY: 'hidden' },
    enter: { opacity: 1, height },
    config: optionalConfig || { ...config.gentle, clamp: true },
    update: { height },
  });
}

function useExpandSpring(ref, initialElementHeight, toggle, optionalConfig) {
  const { height = 0 } = useResizeObserver({ ref });
  return useSpring({
    overflowY: 'hidden',
    height: toggle ? height : initialElementHeight,
    opacity: toggle ? 1 : 0,
    config: optionalConfig || { ...config.gentle, clamp: true },
  });
}
export { useExpandTransition, useExpandSpring };
