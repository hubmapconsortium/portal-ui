export const truncateText = (inputText: string) => {
  if (inputText.length > 100) {
    return `${inputText.slice(0, 100)}...`;
  }
  return inputText;
};
