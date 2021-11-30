function removeUUIDFromOption(option, uuid) {
  const split = option.split('-');
  const uuidIndex = split.findIndex((item) => item === uuid);
  if (uuidIndex >= 0) {
    split.splice(uuidIndex, 1);
    return split.join('-');
  }
  return option;
}
function getOptionLabels(options, uuid) {
  return options.reduce((acc, option) => {
    acc[option] = removeUUIDFromOption(option, uuid);
    return acc;
  }, {});
}

export { removeUUIDFromOption, getOptionLabels };
