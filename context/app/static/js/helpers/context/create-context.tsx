import { createContext as createContextNative } from 'react';

/**
 * Overloads for the `createContext` function to ease the creation of new contexts.
 * Allows for the instantiation of typed contexts without having to specify the default values.
 * @param displayName The display name to apply to the context
 */
export function createContext<T>(displayName: string): React.Context<T | undefined>;
export function createContext<T>(displayName: string, defaultValue: T): React.Context<T>;
export function createContext<T>(displayName: string, defaultValue?: T) {
  const context =
    defaultValue !== undefined ? createContextNative<T>(defaultValue) : createContextNative<T | undefined>(undefined);
  context.displayName = displayName;
  return context;
}
