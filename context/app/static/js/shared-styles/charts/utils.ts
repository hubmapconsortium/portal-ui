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

function defaultXScaleRange(max: number): [number, number] {
  return [0, max];
}

function defaultYScaleRange(max: number): [number, number] {
  return [max, 0];
}

export { getChartDimensions, trimStringWithMiddleEllipsis, defaultXScaleRange, defaultYScaleRange };
