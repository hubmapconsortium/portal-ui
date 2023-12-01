import React from 'react';
import PropTypes from 'prop-types';

import { StyledRect } from './style';

function StackedBar({ direction, bar, hoverProps, yScale, xScale }) {
  const maxBarThickness = 65;

  // props are inversed for vertical and horizontal charts
  const propMap = {
    horizontal: {
      scale: xScale,
      length: 'width',
      thickness: 'height',
      discreteAxis: 'x',
      categoricalAxis: 'y',
    },
    vertical: {
      scale: yScale,
      length: 'height',
      thickness: 'width',
      discreteAxis: 'y',
      categoricalAxis: 'x',
    },
  };

  const { length, thickness, discreteAxis, categoricalAxis } = propMap[direction];

  const dimensionsAndPlacementProps = {
    [length]: bar[length],
    [discreteAxis]: bar[discreteAxis],
    [thickness]: Math.min(bar[thickness], maxBarThickness),
    [categoricalAxis]: bar[categoricalAxis] + Math.max(0, bar[thickness] - maxBarThickness) / 2,
  };
  return (
    <StyledRect
      fill={bar.color}
      {...dimensionsAndPlacementProps}
      $showHover={Object.keys(hoverProps).length > 0}
      {...hoverProps}
      data-key={bar.key}
      data-value={bar.value}
    />
  );
}

StackedBar.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
};

StackedBar.defaultProps = {
  direction: 'vertical',
};

export default StackedBar;
