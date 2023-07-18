import React from 'react';
import { render, screen } from 'test-utils/functions';
import { FlaskDataContext } from 'js/components/Contexts';
import Attribution from './Attribution';

test('text displays properly', () => {
  render(
    <FlaskDataContext.Provider
      value={{
        entity: {
          group_name: 'Test Group',
          created_by_user_displayname: 'Test User',
          created_by_user_email: 'test@test.com',
        },
      }}
    >
      <Attribution />
    </FlaskDataContext.Provider>,
  );
  const textToTest = ['Attribution', 'Group', 'Fake TMC', 'Registered by', 'Fake Name', 'fake@fake.com'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
