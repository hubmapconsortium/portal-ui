import { create, StateCreator } from 'zustand';
import { createStore } from 'zustand/vanilla';

import { persist, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// These helpers abstract away some of the type ugliness from using zustand middleware
// Without these type definitions for the initializer function, the `no-unsafe-assignments` lint rule throws errors

/**
 * Creates a Zustand React store using `immer` middleware
 * @param initializer Immer-compatible Zustand initializer function
 * @returns Zustand React `useStore` hook
 */
export const createImmer = <T>(initializer: StateCreator<T, [['zustand/immer', never]], []>) =>
  create(immer(initializer));

/**
 * Creates a Zustand React store using `persist` middleware
 * @param initializer Zustand initializer function
 * @param options Zustand persist middleware options
 * @returns Zustand React `useStore` hook
 */
export const createPersist = <T>(
  initializer: StateCreator<T, [['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => create(persist(initializer, options));

/**
 * Creates a Zustand React store using `persist` and `immer` middleware
 * @param initializer Zustand initializer function
 * @param options Zustand persist middleware options
 * @returns Zustand React `useStore` hook
 */
export const createImmerPersist = <T>(
  initializer: StateCreator<T, [['zustand/immer', never], ['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => create(immer(persist(initializer, options)));

/**
 * Creates a Zustand vanilla store using `immer` middleware
 * @param initializer Immer-compatible Zustand initializer function
 * @returns Zustand vanilla store
 */
export const createStoreImmer = <T>(initializer: StateCreator<T, [['zustand/immer', never]], []>) =>
  createStore(immer(initializer));

/**
 * Creates a Zustand Vanilla store using `persist` middleware
 * @param initializer Zustand initializer function
 * @param options Zustand persist middleware options
 * @returns Zustand React `useStore` hook
 */
export const createStorePersist = <T>(
  initializer: StateCreator<T, [['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => createStore(persist(initializer, options));

/**
 * Creates a Zustand Vanilla store using `persist` and `immer` middleware
 * @param initializer Immer-compatible Zustand initializer function
 * @param options Zustand persist middleware options
 * @returns Zustand React `useStore` hook
 */
export const createStoreImmerPersist = <T>(
  initializer: StateCreator<T, [['zustand/immer', never], ['zustand/persist', unknown]], []>,
  options: PersistOptions<T, T>,
) => createStore(immer(persist(initializer, options)));
