function getChartDimensions(parentWidth, parentHeight, margin) {
  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  return { xWidth, yHeight };
}

export { getChartDimensions };
