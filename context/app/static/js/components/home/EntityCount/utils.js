const formatCount = (inputCount) => {
  if (inputCount > 9999) {
    const countInThousands = inputCount / 1000;
    return `${(Math.floor(countInThousands * 10) / 10).toFixed(1)}k`;
  }
  return inputCount;
};

export { formatCount };
