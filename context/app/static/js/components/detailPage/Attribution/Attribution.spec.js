import React from 'react';
import { render, screen } from 'test-utils/functions';

import { FlaskDataContext } from 'js/components/Contexts';
import Attribution from './Attribution';

test('text displays properly', () => {
  const flaskDataContext = {
    entity: {
      group_name: 'Fake TMC',
      created_by_user_displayname: 'Fake Name',
      created_by_user_email: 'fake@fake.com',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Attribution />
    </FlaskDataContext.Provider>,
  );
  const textToTest = ['Attribution', 'Group', 'Fake TMC', 'Registered by', 'Fake Name', 'fake@fake.com'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
