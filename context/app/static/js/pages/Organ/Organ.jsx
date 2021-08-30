import React from 'react';

function Organ(props) {
  const { organ } = props;

  return <pre>{JSON.stringify(organ, null, 2)}</pre>;
}

export default Organ;
