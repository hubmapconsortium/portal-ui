import React from 'react';
import { render, screen } from '@testing-library/react';
import Attribution from './Attribution';

jest.mock('js/components/Contexts', () => ({
  useFlaskDataContext: jest.fn(),
}));

test('text displays properly', () => {
  const group_name = 'Fake TMC';
  const created_by_user_displayname = 'Fake Name';
  const created_by_user_email = 'fake@fake.com';

  const mockUseFlaskDataContext = jest.fn().mockReturnValue({
    entity: {
      group_name,
      created_by_user_displayname,
      created_by_user_email,
    },
  });
  jest.doMock('js/components/Contexts', () => ({
    useFlaskDataContext: mockUseFlaskDataContext,
  }));

  render(<Attribution />);

  const textToTest = ['Attribution', 'Group', 'Fake TMC', 'Registered by', 'Fake Name', 'fake@fake.com'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
