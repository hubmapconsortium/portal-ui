import React from 'react';
import { render, screen } from 'test-utils/functions';
import Attribution from './Attribution';

test('text displays properly', () => {
  render(<Attribution />);
  const textToTest = ['Attribution', 'Group', 'Fake TMC', 'Registered by', 'Fake Name', 'fake@fake.com'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
