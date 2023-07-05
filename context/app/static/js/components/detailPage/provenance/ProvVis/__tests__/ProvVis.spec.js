import React from 'react';
import { render } from 'test-utils/functions';

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

  it('renders React component', () => {
    render(<ProvVis provData={simple.prov} />, node, () => {
      expect(node.innerHTML).toContain('svg');
    });
  });
});
