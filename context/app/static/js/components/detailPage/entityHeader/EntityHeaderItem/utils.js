export const truncateText = (inputText) => {
  if (inputText.length > 100) {
    return `${inputText.slice(0, 100)}...`;
  }
  return inputText;
};
