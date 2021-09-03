// import React from 'react';

function Iframe() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/iframe/entity-counts':
      return 'TODO: entity-counts';
    case '/iframe/assay-barchart':
      return 'TODO: assay-barchart';
    default:
      console.error('No such iframe');
      return 'ERROR: No such iframe';
  }
}

export default Iframe;
