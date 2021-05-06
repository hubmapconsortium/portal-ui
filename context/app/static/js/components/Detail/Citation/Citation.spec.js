import { buildNLMCitation } from './Citation';

test('builds NLM citation', () => {
  const contributors = [
    { last_name: 'Aanders', first_name: 'Aanne' },
    { last_name: 'Banders', first_name: 'Banne' },
    { last_name: 'Canders', first_name: 'Canne' },
  ];
  const title = 'Something Science-y';
  const timestamp = 1520153805000;
  expect(buildNLMCitation({ contributors, title, timestamp })).toEqual(
    'Aanders A, Banders B, Canders C. Something Science-y [Internet]. HuBMAP Consortium; 2018.',
  );
});
