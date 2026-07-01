import { useTransition, useSpring, config, SpringConfig } from '@react-spring/web';
import { RefObject } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';

function useExpandTransition(
  ref: RefObject<Element | null>,
  initialElementHeight: number,
  optionalConfig?: Partial<SpringConfig>,
) {
  // use-resize-observer's types predate React 19's nullable RefObject default.
  const { height = 0 } = useResizeObserver({ ref: ref as RefObject<Element> });

  return useTransition(true, {
    from: { opacity: 0, height: initialElementHeight, overflowY: 'hidden' },
    enter: { opacity: 1, height },
    config: optionalConfig ?? { ...config.gentle, clamp: true },
    update: { height },
  });
}

function useExpandSpring(
  ref: RefObject<Element | null>,
  initialElementHeight: number,
  toggle: boolean,
  optionalConfig?: Partial<SpringConfig>,
) {
  // use-resize-observer's types predate React 19's nullable RefObject default.
  const { height = 0 } = useResizeObserver({ ref: ref as RefObject<Element> });
  return useSpring<Element>({
    overflowY: 'hidden',
    height: toggle ? height : initialElementHeight,
    opacity: toggle ? 1 : 0,
    config: optionalConfig ?? { ...config.gentle, clamp: true },
  });
}
export { useExpandTransition, useExpandSpring };
