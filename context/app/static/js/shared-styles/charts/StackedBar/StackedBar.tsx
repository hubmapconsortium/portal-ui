import React, { SVGProps } from 'react';

import LZString from 'lz-string';
import { FiltersType } from 'js/components/search/store';
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

  const rect = (
    <StyledRect fill={bar.color} {...mappedProps} $showHover={Boolean(hoverProps) || Boolean(href)} {...hoverProps} />
  );
  if (href) {
    const page = href.split('?')[0].replace('/search/', '');
    const encodedURI = href.split('?')[1];
    interface searchObj {
      filters: FiltersType;
    }

    const decodedHref = JSON.parse(LZString.decompressFromEncodedURIComponent(encodedURI)) as searchObj;

    // Extracting the filters from the searchURI
    const extractedValues = (() => {
      const results: string[] = [];
      Object.values(decodedHref.filters).forEach(({ values }) => {
        if (Array.isArray(values)) {
          results.push(...values);
        } else if (typeof values === 'object' && values !== null) {
          results.push(...Object.keys(values));
        }
      });
      return results;
    })();

    const labelString = `${page} page for the selected bar representing ${extractedValues.join(', ')}`;

    return (
      <a href={href} target="_parent" aria-label={labelString}>
        {rect}
      </a>
    );
  }
  return rect;
}

export default StackedBar;
