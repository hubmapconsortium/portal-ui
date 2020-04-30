export function isEmptyArrayOrObject(val) {
  let ret = false;
  if (val.constructor.name === 'Object') {
    ret = Object.keys(val).length === 0;
  } else if (val.constructor.name === 'Array') {
    ret = val.length === 0;
  }
  return ret;
}
