import { PositionScale } from '@visx/shape/lib/types';

function getChartDimensions(
  parentWidth: number,
  parentHeight: number,
  margin: Record<'top' | 'right' | 'bottom' | 'left', number> = { top: 0, right: 0, bottom: 0, left: 0 },
) {
  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  return { xWidth, yHeight };
}

function trimStringWithMiddleEllipsis(str?: string): string {
  if (!str) return '';
  return str.replace(/^(.{15}).+(.{10})$/, '$1...$2');
}

// Set the default range for the x scale, assuming it is linear
function defaultXScaleRange(scale: PositionScale, max: number) {
  if ('rangeRound' in scale) {
    scale.rangeRound([0, max]);
  } else {
    scale.range([0, max]);
  }
}

function defaultYScaleRange(scale: PositionScale, max: number) {
  if ('rangeRound' in scale) {
    scale.rangeRound([max, 0]);
  } else {
    scale.range([max, 0]);
  }
}

export { getChartDimensions, trimStringWithMiddleEllipsis, defaultXScaleRange, defaultYScaleRange };
