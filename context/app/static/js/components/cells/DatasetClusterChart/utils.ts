function removeUUIDFromOption(option: string, uuid: string) {
  const split = option.split('-');
  const uuidIndex = split.findIndex((item) => item === uuid);
  if (uuidIndex >= 0) {
    split.splice(uuidIndex, 1);
    return split.join('-');
  }
  return option;
}
function getOptionLabels(options: string[], uuid: string) {
  return options.reduce<Record<string, string>>((acc, option) => {
    acc[option] = removeUUIDFromOption(option, uuid);
    return acc;
  }, {});
}

function addMatchedAndUnmatched({ matched, unmatched }: { matched: number; unmatched: number }) {
  return matched + unmatched;
}

export { removeUUIDFromOption, getOptionLabels, addMatchedAndUnmatched };
