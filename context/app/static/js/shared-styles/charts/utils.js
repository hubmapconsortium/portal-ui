function getChartDimensions(parentWidth, parentHeight, margin) {
  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  return { xWidth, yHeight };
}

function trimStringWithMiddleEllipsis(str) {
  return str.replace(/^(.{15}).+(.{10})$/, '$1...$2');
}

export { getChartDimensions, trimStringWithMiddleEllipsis };
