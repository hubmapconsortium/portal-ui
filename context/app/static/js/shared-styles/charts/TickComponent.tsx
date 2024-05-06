import React, { useCallback } from 'react';
import { TickRendererProps } from '@visx/axis';
import { Text } from '@visx/text';

import { trimStringWithMiddleEllipsis } from './utils';
import { type FormattedValue } from './types';

interface TickComponentWithHandlersProps {
  handleMouseEnter: ({ key }: { key: FormattedValue }) => React.MouseEventHandler<SVGTextElement>;
  handleMouseLeave: React.MouseEventHandler<SVGTextElement> | undefined;
}

function TickComponent({ handleMouseEnter, handleMouseLeave }: TickComponentWithHandlersProps) {
  // use a callback to avoid creating a new component on every render
  return useCallback(
    ({ formattedValue, ...tickProps }: TickRendererProps) => {
      return (
        <Text onMouseEnter={handleMouseEnter({ key: formattedValue })} onMouseLeave={handleMouseLeave} {...tickProps}>
          {trimStringWithMiddleEllipsis(formattedValue)}
        </Text>
      );
    },
    [handleMouseEnter, handleMouseLeave],
  );
}

export default TickComponent;
