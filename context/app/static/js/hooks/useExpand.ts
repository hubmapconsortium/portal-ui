import { useTransition, useSpring, config, SpringConfig } from '@react-spring/web';
import { RefObject } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';

function useExpandTransition(
  ref: RefObject<Element>,
  initialElementHeight: number,
  optionalConfig?: Partial<SpringConfig>,
) {
  const { height = 0 } = useResizeObserver({ ref });

  return useTransition(true, {
    from: { opacity: 0, height: initialElementHeight, overflowY: 'hidden' },
    enter: { opacity: 1, height },
    config: optionalConfig ?? { ...config.gentle, clamp: true },
    update: { height },
  });
}

function useExpandSpring(
  ref: RefObject<Element>,
  initialElementHeight: number,
  toggle: boolean,
  optionalConfig?: Partial<SpringConfig>,
) {
  const { height = 0 } = useResizeObserver({ ref });
  return useSpring<Element>({
    overflowY: 'hidden',
    height: toggle ? height : initialElementHeight,
    opacity: toggle ? 1 : 0,
    config: optionalConfig ?? { ...config.gentle, clamp: true },
  });
}
export { useExpandTransition, useExpandSpring };
