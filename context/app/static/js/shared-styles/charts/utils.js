function getChartDimensions(parentWidth, parentHeight, margin) {
  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  return { xWidth, yHeight };
}

function trimStringWithMiddleEllipsis(str) {
  if (str.length > 25) {
    return `${str.substr(0, 15)}...${str.substr(str.length - 10, str.length)}`;
  }
  return str;
}

export { getChartDimensions, trimStringWithMiddleEllipsis };
