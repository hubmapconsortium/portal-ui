import React from 'react';

function Organs(props) {
  const { organs } = props;

  return <pre>{JSON.stringify(organs, null, 2)}</pre>;
}

export default Organs;
