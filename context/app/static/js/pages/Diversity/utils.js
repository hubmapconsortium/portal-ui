function getAgeLabels(buckets, key) {
  return [...new Set(buckets.map((b) => (b.key[key] === 0 ? '<10' : `${b.key[key]}-${b.key[key] + 9}`)))];
}

function getKeyValues(buckets, key) {
  return [...new Set(buckets.map((b) => b.key[key]))];
}

export { getAgeLabels, getKeyValues };
