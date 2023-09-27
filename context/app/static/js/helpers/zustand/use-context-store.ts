import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

import { type Context } from 'react';
import { type StoreApi } from 'zustand';

import { useContext } from '../context';
import { type ExtractState } from './types';

interface CurriedUseStore<T extends StoreApi<unknown>> {
  (): ExtractState<T>;
  <U>(selector: (state: ExtractState<T>) => U): U;
  <U>(selector: (state: ExtractState<T>) => U, equalityFn?: (state: U, newState: U) => boolean): U;
}

export function createStoreContextHook<T>(storeContext: Context<StoreApi<T> | undefined>) {
  function useCurriedZustandContext<U>(selector: (state: T) => U): U;
  function useCurriedZustandContext<U>(
    selector: (state: T) => U = (state: T) => state as unknown as U,
    equalityFn: ((state: U, newState: U) => boolean) | undefined = shallow,
  ): U {
    const store = useContext<StoreApi<T>>(storeContext);
    return useStoreWithEqualityFn(store, selector, equalityFn);
  }
  return useCurriedZustandContext as CurriedUseStore<StoreApi<T>>;
}
