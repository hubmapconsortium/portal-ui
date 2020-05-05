export function isEmptyArrayOrObject(val) {
  if (val.constructor.name === 'Object') {
    return Object.keys(val).length === 0;
  }
  if (val.constructor.name === 'Array') {
    return val.length === 0;
  }
  return false;
}

export function replaceUnderscore(str) {
  return str.replace(/_/g, ' ');
}
