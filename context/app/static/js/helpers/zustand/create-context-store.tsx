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

type CreateStoreContext<StoreType extends StoreApi<unknown>, CreateStoreArgs> = [
  Context<StoreType | undefined>,
  (props: PropsWithChildren<CreateStoreArgs>) => ReactNode,
  CurriedUseStore<StoreType>,
];

/**
 * Helper function for creating a context and provider for a zustand store.
 *
 * @param createStore The initializer function that creates the zustand store. Its parameters are the expected props for the provider.
 * @param displayName The display name for the created context
 * @returns A Context and Provider for the created store
 */
export function createStoreContext<T, CreateStoreArgs>(
  createStore: (initialArgs: CreateStoreArgs) => StoreApi<T>,
  displayName: string,
) {
  type StoreType = StoreApi<T>;
  // Create a context for the passed `createStore` function's return type
  const StoreContext = createContext<StoreType>(displayName);
  // Create a provider component which creates the store and passes it to the context
  function Provider({ children, ...props }: PropsWithChildren<CreateStoreArgs>) {
    // Keep the store in a ref so it is only created once per instance of the provider
    const store = useRef<StoreType>();
    if (!store.current) {
      store.current = createStore(props as CreateStoreArgs);
    }
    return <StoreContext.Provider value={store.current}>{children}</StoreContext.Provider>;
  }
  const hook = createStoreContextHook(StoreContext);
  return [StoreContext, Provider, hook] as CreateStoreContext<StoreApi<T>, CreateStoreArgs>;
}
