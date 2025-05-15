import React, { FocusEventHandler, MouseEventHandler, SVGProps, useId, useMemo } from 'react';
import { StyledRect } from './style';
import { OrdinalScale } from '../hooks';

type Direction = 'vertical' | 'horizontal';

interface Bar {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  key: string;
}
interface StackedBarProps extends SVGProps<SVGRectElement> {
  direction: Direction;
  bar: Bar;
  hoverProps?: Record<string, unknown>;
  href?: string;
  ariaLabelText?: string;
  colorScale?: OrdinalScale;
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

function Fill({ bar, colorScale, id }: { bar: Bar; colorScale?: OrdinalScale; id: string }) {
  const barKey = bar.key;
  const barKeys = String(barKey).split(', ');

  // If it's a single-key bar or a separate scale is not provided, the pattern should just reflect the color
  if (barKeys.length === 1 || !colorScale) {
    return (
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="1.5" height="1.5" patternTransform="rotate(90)">
          <rect width="100%" height="100%" fill={bar.color} />
        </pattern>
      </defs>
    );
  }

  return (
    <defs>
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width={barKeys.length}
        height={barKeys.length}
        patternTransform="rotate(90)"
      >
        {barKeys.map((key, index) => {
          return (
            <line
              key={key}
              x1={index + 0.5}
              y1={0}
              x2={index + 0.5}
              y2={barKeys.length}
              stroke={colorScale(key)}
              strokeWidth="1"
            />
          );
        })}
      </pattern>
    </defs>
  );
}

interface HoverPropsWithFocus {
  onMouseEnter: MouseEventHandler<HTMLOrSVGElement>;
  onMouseLeave: MouseEventHandler<HTMLOrSVGElement>;
  onFocusCapture: FocusEventHandler<HTMLOrSVGElement>;
  onBlurCapture: FocusEventHandler<HTMLOrSVGElement>;
}

const useHoverPropsWithFocus: (hoverProps?: Record<string, unknown>) => HoverPropsWithFocus | undefined = (
  hoverProps?: Record<string, unknown>,
) => {
  return useMemo(() => {
    if (hoverProps?.onMouseEnter && hoverProps?.onMouseLeave) {
      return {
        onMouseEnter: hoverProps.onMouseEnter,
        onMouseLeave: hoverProps.onMouseLeave,
        onFocusCapture: hoverProps.onMouseEnter,
        onBlurCapture: hoverProps.onMouseLeave,
      } as HoverPropsWithFocus;
    }
    return undefined;
  }, [hoverProps]);
};

function StackedBar({ direction = 'vertical', bar, hoverProps, href, ariaLabelText, colorScale }: StackedBarProps) {
  const maxBarThickness = 65;

  const { length, thickness, discreteAxis, categoricalAxis } = propMap[direction];

  const barProps = useMemo(
    () => ({
      [length]: bar[length],
      [discreteAxis]: bar[discreteAxis],
      [thickness]: Math.min(bar[thickness], maxBarThickness),
      [categoricalAxis]: bar[categoricalAxis] + Math.max(0, bar[thickness] - maxBarThickness) / 2,
    }),
    [bar, categoricalAxis, discreteAxis, length, thickness],
  );

  const id = `stacked-bar-${useId()}`;

  const hoverPropsWithFocus = useHoverPropsWithFocus(hoverProps);

  const rect = (
    <>
      <Fill bar={bar} colorScale={colorScale} id={id} />
      <StyledRect
        fill={`url(#${id})`}
        {...barProps}
        $showHover={Boolean(hoverProps) || Boolean(href)}
        {...hoverPropsWithFocus}
        data-bar={JSON.stringify(bar)}
      />
    </>
  );

  if (href) {
    return (
      <a href={href} target="_parent" aria-label={ariaLabelText} {...hoverPropsWithFocus}>
        {rect}
      </a>
    );
  }
  return rect;
}

export default StackedBar;
