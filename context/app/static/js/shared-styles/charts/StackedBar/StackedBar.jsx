import React from 'react';
import PropTypes from 'prop-types';

function StackedBar({ direction, bar, barStack, hoveredBarIndices, handleMouseEnter, handleMouseLeave }) {
  const strokeWidth = 1.5;
  const maxBarThickness = 65;

  // props are inversed for vertical and horizontal charts
  const propMap = {
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

  const { length, thickness, discreteAxis, categoricalAxis } = propMap[direction];

  const dimensionsAndPlacementProps = {
    [length]: bar[length] - strokeWidth,
    [discreteAxis]: bar[discreteAxis] + strokeWidth / 2,
    [thickness]: Math.min(bar[thickness], maxBarThickness),
    [categoricalAxis]:
      bar[thickness] > maxBarThickness
        ? bar[categoricalAxis] + (bar[thickness] - maxBarThickness) / 2
        : bar[categoricalAxis],
  };

  return (
    <rect
      fill={bar.color}
      stroke={
        hoveredBarIndices &&
        bar.index === hoveredBarIndices.barIndex &&
        barStack.index === hoveredBarIndices.barStackIndex
          ? 'black'
          : bar.color
      }
      strokeWidth={strokeWidth}
      onMouseEnter={(event) => handleMouseEnter(event, bar, barStack.index)}
      onMouseLeave={handleMouseLeave}
      {...dimensionsAndPlacementProps}
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
