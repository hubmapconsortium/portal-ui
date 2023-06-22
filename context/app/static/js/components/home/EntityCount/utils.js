const formatCount = (inputCount) => {
  if (inputCount > 9999) {
    return `${(inputCount / 1000).toFixed(1)}k+`;
  }
  return inputCount;
};

export { formatCount };
