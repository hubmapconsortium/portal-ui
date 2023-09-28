import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

import React, { PropsWithChildren, type Context, type ReactNode, useRef } from 'react';
import { type StoreApi } from 'zustand';

import { useContext, createContext } from '../context';
import { type ExtractState } from './types';

/**
 * A curried version of the `useStore` hook from zustand; this hook is bound to a store instance in a context.
 * @param selector A selector function which takes the store state and returns a value
 * @param equalityFn An optional equality function which takes the previous and new values and returns a boolean
 */
interface CurriedUseStore<T extends StoreApi<unknown>> {
  (): ExtractState<T>;
  <U>(selector: (state: ExtractState<T>) => U): U;
  <U>(selector: (state: ExtractState<T>) => U, equalityFn?: (state: U, newState: U) => boolean): U;
}

/**
 * Helper function for creating a `useStore` hook for a context-bound zustand store.
 * @param storeContext the Context object to create the hook for
 * @returns A `useStore` hook for the passed context which can be called with a selector and equality function
 */
export function createStoreContextHook<T, S extends StoreApi<T>>(storeContext: Context<S | undefined>) {
  function useCurriedZustandContext<U>(selector: (state: T) => U): U;
  function useCurriedZustandContext<U>(
    selector: (state: T) => U = (state: T) => state as unknown as U,
    equalityFn: ((state: U, newState: U) => boolean) | undefined = shallow,
  ): U {
    const store = useContext<S>(storeContext);
    return useStoreWithEqualityFn(store, selector, equalityFn);
  }
  return useCurriedZustandContext as CurriedUseStore<S>;
}

/**
 * Helper function for creating a context and provider for a zustand store.
 * @param createStore The `createStore` function that creates the zustand store. Its parameters are the expected props for the provider.
 * @param displayName The display name for the created context
 * @returns A Context and Provider for the created store
 */
export function createStoreContext<T, S extends StoreApi<T>>(
  createStore: (props: unknown) => S,
  displayName: string,
): [Context<S | undefined>, (props: PropsWithChildren<Parameters<typeof createStore>>) => ReactNode] {
  // Create a context for the passed `createStore` function's return type
  const StoreContext = createContext<S>(displayName);
  // Alias the parameters of the `createStore` function to `P`
  type P = Parameters<typeof createStore>;
  // Create a provider component which creates the store and passes it to the context
  function Provider({ children, ...props }: PropsWithChildren<P>) {
    // Keep the store in a ref so it is only created once per instance of the provider
    const store = useRef<S>();
    if (!store.current) {
      store.current = createStore(props);
    }
    return <StoreContext.Provider value={store.current}>{children}</StoreContext.Provider>;
  }
  return [StoreContext, Provider];
}
