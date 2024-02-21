/* eslint-disable import/no-extraneous-dependencies */
import { State } from 'searchkit';
import { produce } from 'immer';

const MAX_LEAF_LEVEL = 1;

export function isParentLevel(level) {
  return level === 0;
}
export class LevelState extends State {
  static value;

  getValue() {
    return this.value || {};
  }

  add(level, val) {
    if (isParentLevel(level)) {
      return this.create({ ...this.value, [val.key]: val[val.childField].buckets.map((b) => b.key) });
    }

    return this.create(
      produce(this.value, (draft) => {
        draft[val.parentKey] = [...draft[val.parentKey], val.key];
      }),
    );
  }

  contains(level, val) {
    if (isParentLevel(level)) {
      return val.key in this.getValue();
    }
    return this.getValue()[val.parentKey].includes(val.key);
  }

  remove(level, val) {
    if (isParentLevel(level)) {
      return this.create(
        produce(this.value, (draft) => {
          delete draft[val.key];
        }),
      );
    }
    return this.create(
      produce(this.value, (draft) => {
        const index = draft[val.parentKey].indexOf(val.key);
        draft[val.parentKey].splice(index, 1);
      }),
    );
  }

  isLeafLevel(level) {
    return level === MAX_LEAF_LEVEL || this.getLevel(0).length === 0;
  }

  getLevel(level) {
    if (isParentLevel(level)) {
      return Object.keys(this.getValue());
    }

    return Object.values(this.getValue()).flat();
  }

  levelHasFilters(level) {
    return this.getLevel(level).length > 0;
  }

  toggleLevel({ level, option }) {
    if (this.contains(level, option)) {
      return this.remove(level, option);
    }
    return this.add(level, option);
  }
}
