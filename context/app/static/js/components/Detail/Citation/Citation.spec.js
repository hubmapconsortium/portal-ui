import { buildNLMCitation } from './Citation';

test('builds long NLM citation', () => {
  const contributors = [
    { last_name: 'Aanders', first_name: 'Aanne' },
    { last_name: 'Banders', first_name: 'Banne' },
    { last_name: 'Canders', first_name: 'Canne' },
    { last_name: 'Danders', first_name: 'Danne' },
    { last_name: 'Eanders', first_name: 'Eanne' },
    { last_name: 'Fanders', first_name: 'Fanne' },
    { last_name: 'Ganders', first_name: 'Ganne' },
  ];
  const title = 'Something Science-y';
  const timestamp = 1620153805000;
  expect(buildNLMCitation({ contributors, title, timestamp })).toEqual(
    'Aanders A, Banders B, Canders C, Danders D, Eanders E, Fanders F, et al. Something Science-y [Internet]. HuBMAP Consortium; 2021.',
  );
});

test('builds short NLM citation', () => {
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
