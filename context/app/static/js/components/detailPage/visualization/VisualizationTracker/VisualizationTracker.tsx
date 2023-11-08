import React, { PropsWithChildren } from 'react';
import { useVisualizationTracker } from './hooks';

type VisualizationTrackerProps = PropsWithChildren;

/**
 * Since `Vitessce` does not include native support for tracking,
 * wrapping it in a span and inferring the action based on the target is a workaround.
 */
function VisualizationTracker({ children }: VisualizationTrackerProps) {
  const { ref, props } = useVisualizationTracker();

  return (
    <span ref={ref} {...props}>
      {children}
    </span>
  );
}

export default VisualizationTracker;
