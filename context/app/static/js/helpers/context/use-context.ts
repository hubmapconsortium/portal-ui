import React, { useContext as useContextNative } from 'react';

/**
 * Type-safe `useContext` hook that throws if the context is undefined.
 * @param context The react context to use
 * @returns The value of the context
 * @throws If the context is undefined
 */
export function useContext<T>(context: React.Context<T>): NonNullable<T>;
export function useContext<T>(context: React.Context<T | undefined>): T {
  const contextValue = useContextNative(context);
  if (contextValue === undefined) {
    throw new Error(
      `useContext must be inside a Provider with a value${
        context.displayName && `, missing provider for ${context.displayName}`
      }`,
    );
  }
  return contextValue;
}
