import produce from 'immer';

export default (config) => (set, get) => config((fn) => set(produce(fn)), get);
