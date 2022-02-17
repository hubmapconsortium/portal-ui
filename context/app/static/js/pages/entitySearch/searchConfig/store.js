/* eslint-disable no-param-reassign */
import create from 'zustand';

import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = ({ fields, filters }) =>
  create(() => ({
    fields,
    filters,
  }));

export { createStore, Provider, useStore };
