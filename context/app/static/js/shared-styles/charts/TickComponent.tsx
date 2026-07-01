import React, { useCallback } from 'react';
import { TickRendererProps } from '@visx/axis';
import { Text } from '@visx/text';

import { trimStringWithMiddleEllipsis } from './utils';
import { TooltipData } from './types';

interface TickComponentWithHandlersProps<T> {
  handleMouseEnter: (tooltipData: TooltipData<T>) => React.MouseEventHandler<SVGTextElement>;
  handleMouseLeave: React.MouseEventHandler<SVGTextElement> | undefined;
  data?: Record<string, T>;
}

function TickComponent<T>({ handleMouseEnter, handleMouseLeave, data }: TickComponentWithHandlersProps<T>) {
  // use a callback to avoid creating a new component on every render
  return useCallback(
    ({ formattedValue, ...tickProps }: TickRendererProps) => {
      // Create complete tooltip data structure similar to bar hover
      const key = String(formattedValue);
      const tooltipData: TooltipData<T> = {
        key,
        bar: data && data[key] ? { data: data[key] } : undefined,
      };
      const showTooltip = handleMouseEnter(tooltipData);

      return (
        // Also show on move so the tooltip reliably appears while the pointer is over the label.
        <Text onMouseEnter={showTooltip} onMouseMove={showTooltip} onMouseLeave={handleMouseLeave} {...tickProps}>
          {trimStringWithMiddleEllipsis(formattedValue)}
        </Text>
      );
    },
    [handleMouseEnter, handleMouseLeave, data],
  );
}

export default TickComponent;
