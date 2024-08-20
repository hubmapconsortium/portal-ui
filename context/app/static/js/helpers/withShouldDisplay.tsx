import React, { ComponentType } from 'react';

export default function withShouldDisplay<P extends object>(Component: ComponentType<P>) {
  return function ComponentWithShouldDisplay({ shouldDisplay = true, ...props }: P & { shouldDisplay?: boolean }) {
    if (!shouldDisplay) {
      return null;
    }
    return <Component {...(props as P)} />;
  };
}
