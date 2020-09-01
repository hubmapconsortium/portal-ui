import React from 'react';
import { FacetFilter } from 'searchkit';

function Details(props) {
  const { title, id, children } = props;
  // classNames are copy and paste from Searchkit code.
  return (
    <details className={id ? `filter--${id}` : undefined}>
      <summary className="sk-panel__header">{title}</summary>
      {children}
    </details>
  );
}

function FoldingFilter(props) {
  const innerProps = {
    containerComponent: Details,
    ...props,
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <FacetFilter {...innerProps} />;
}

export default FoldingFilter;
