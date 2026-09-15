import React from 'react';
import { render } from 'test-utils/functions';

import Route from './Route';

test('separates page content from the header by default', () => {
  const { container } = render(
    <Route>
      <div />
    </Route>,
  );

  expect(container.firstChild).toHaveStyle({ marginTop: '8px' });
});

test('drops the gap when disableTopMargin is set', () => {
  const { container } = render(
    <Route disableTopMargin>
      <div />
    </Route>,
  );

  expect(container.firstChild).toHaveStyle({ marginTop: '0px' });
});
