import { createContext as createContextNative, type Context } from 'react';

/**
 * Overloads for the `createContext` function to ease the creation of new contexts.
 * Allows for the instantiation of typed contexts without having to specify the default values.
 * @param displayName The display name to apply to the context
 */
export function createContext<T>(displayName: string): Context<T | undefined>;
export function createContext<T>(displayName: string, defaultValue: T): Context<T>;
export function createContext<T>(displayName: string, defaultValue?: T) {
  const context =
    defaultValue !== undefined ? createContextNative<T>(defaultValue) : createContextNative<T | undefined>(undefined);
  context.displayName = displayName;
  return context;
}
