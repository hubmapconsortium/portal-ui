import { truncateText } from './utils'; // Adjust this import path to match the actual path of your utils file

test('truncateText function should correctly truncate text', () => {
  const longText =
    'This is a long string of text that is definitely longer than one hundred characters. It goes on and on, seemingly without end.';

  expect(truncateText(longText, 100)).toEqual(
    'This is a long string of text that is definitely longer than one hundred characters. It goes on and ...',
  );

  const exactLengthText =
    'This is a string of text that is exactly one hundred characters long. Exactly. No more, no less.';
  expect(truncateText(exactLengthText, 100)).toEqual(exactLengthText);

  const shortText = 'This is a short string of text.';
  expect(truncateText(shortText, 100)).toEqual(shortText);
});
