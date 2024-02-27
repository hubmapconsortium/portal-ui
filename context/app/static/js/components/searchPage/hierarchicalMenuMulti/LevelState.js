import { State } from 'searchkit';
import { produce } from 'immer';

export const PARENT_LEVEL = 0;
export const CHILD_LEVEL = 1;

export function isParentLevel(level) {
  return level === PARENT_LEVEL;
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
    if (this.value[val.parentKey].length === 1) {
      return this.create(
        produce(this.value, (draft) => {
          delete draft[val.parentKey];
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
    return level === CHILD_LEVEL || this.getLevel(1).length === 0;
  }

  getLevel(level) {
    if (isParentLevel(level)) {
      return Object.keys(this.getValue()).map((key) => ({ key }));
    }

    return Object.entries(this.getValue()).reduce((acc, [parentKey, childKeys]) => {
      return [
        ...acc,
        ...childKeys.map((key) => ({
          key,
          parentKey,
        })),
      ];
    }, []);
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
