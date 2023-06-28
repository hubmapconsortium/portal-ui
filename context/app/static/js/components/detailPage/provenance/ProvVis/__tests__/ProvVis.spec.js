import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import ProvVis from '../ProvVis';

import { simple } from './fixtures';

describe('ProvVis', () => {
  let node;
  const ID = 'my-node-id';

  beforeEach(() => {
    node = document.createElement('div');
    node.id = ID;
    document.body.appendChild(node);
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it('renders React component', () => {
    render(<ProvVis provData={simple.prov} />, node, () => {
      // TODO: Just getting empty div.
      expect(node.innerHTML).toContain('svg');
    });
  });
});
