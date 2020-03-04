import React from 'react';

import vitessce from 'vitessce';

export default function VitGrid (props) {
  const vitJSON = props.vitData;

  return setTimeout(() => {
    vitessce.validateAndRender(
      vitJSON,
      'vit-grid',
      100
    )
  }, 0);
}