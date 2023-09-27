import { create, createStore, StateCreator } from 'zustand';

import { persist, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// These helpers abstract away some of the type ugliness from using zustand middleware
// Without these type definitions for the initializer function, the `no-unsafe-assignments` lint rule throws errors
export const createImmer = <T>(initializer: StateCreator<T, [['zustand/immer', never]], []>) =>
  create(immer(initializer));

export const createPersist = <T>(
  initializer: StateCreator<T, [['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => create(persist(initializer, options));

export const createImmerPersist = <T>(
  initializer: StateCreator<T, [['zustand/immer', never], ['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => create(immer(persist(initializer, options)));

export const createStoreImmer = <T>(initializer: StateCreator<T, [['zustand/immer', never]], []>) =>
  createStore(immer(initializer));

export const createStorePersist = <T>(
  initializer: StateCreator<T, [['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => createStore(persist(initializer, options));

export const createStoreImmerPersist = <T>(
  initializer: StateCreator<T, [['zustand/immer', never], ['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => createStore(immer(persist(initializer, options)));
