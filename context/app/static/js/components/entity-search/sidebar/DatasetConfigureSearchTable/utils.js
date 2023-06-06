/* eslint-disable no-param-reassign */
import { produce } from 'immer';

function invertKeyToArrayMap(map) {
  return Object.entries(map).reduce((acc, [key, valuesArray]) => {
    return produce(acc, (draft) => {
      valuesArray.forEach((v) => {
        if (!(v in draft)) draft[v] = [];
        draft[v] = [...draft[v], key];
      });
    });
  }, {});
}

export { invertKeyToArrayMap };
