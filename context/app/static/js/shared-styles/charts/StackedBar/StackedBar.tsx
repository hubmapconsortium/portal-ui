import React, { SVGProps } from 'react';

import { StyledRect } from './style';

type Direction = 'vertical' | 'horizontal';

interface StackedBarProps extends SVGProps<SVGRectElement> {
  direction: Direction;
  bar: {
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
  };
  hoverProps?: Record<string, unknown>;
  href?: string;
}

interface MappableProps {
  length: 'width' | 'height';
  thickness: 'width' | 'height';
  discreteAxis: 'x' | 'y';
  categoricalAxis: 'x' | 'y';
}

const propMap: Record<Direction, MappableProps> = {
  horizontal: {
    length: 'width',
    thickness: 'height',
    discreteAxis: 'x',
    categoricalAxis: 'y',
  },
  vertical: {
    length: 'height',
    thickness: 'width',
    discreteAxis: 'y',
    categoricalAxis: 'x',
  },
};

function StackedBar({ direction = 'vertical', bar, hoverProps, href }: StackedBarProps) {
  const maxBarThickness = 65;

  const { length, thickness, discreteAxis, categoricalAxis } = propMap[direction];

  const mappedProps = {
    [length]: bar[length],
    [discreteAxis]: bar[discreteAxis],
    [thickness]: Math.min(bar[thickness], maxBarThickness),
    [categoricalAxis]: bar[categoricalAxis] + Math.max(0, bar[thickness] - maxBarThickness) / 2,
  };

  const rect = <StyledRect fill={bar.color} {...mappedProps} $showHover={Boolean(hoverProps)} {...hoverProps} />;
  if (href) {
    return (
      <a href={href} target="_parent">
        {rect}
      </a>
    );
  }
  return rect;
}

export default StackedBar;
