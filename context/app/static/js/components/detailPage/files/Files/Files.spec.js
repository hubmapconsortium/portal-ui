import React, { useMemo } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved, appProviderEndpoints } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { FlaskDataContext } from 'js/components/Contexts';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import Files from './Files';

const testUuid = 'fakeuuid';
const mapped_data_access_level = 'fakeaccess';

const globusUrlResponse = {
  url: 'fakeglobusurl',
};

const server = setupServer(
  rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/dataset/globus-url/${testUuid}`, (req, res, ctx) => {
    return res(ctx.json(globusUrlResponse), ctx.status(200));
  }),
);

const sharedEntries = {
  edam_term: 'faketerm',
  description: 'fakedescription',
  size: 1000,
  type: 'faketype',
};

const testFiles = [
  {
    rel_path: 'path1/path2/fake1.txt',
    ...sharedEntries,
  },
  {
    rel_path: 'path1/path2/fake2.txt',
    ...sharedEntries,
  },
  {
    rel_path: 'path1/fake3.txt',
    ...sharedEntries,
  },
  {
    rel_path: 'path3/fake4.txt',
    ...sharedEntries,
  },
  {
    rel_path: 'fake5.txt',
    ...sharedEntries,
  },
];

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const flaskDataContext = { entity: { entity_type: 'Dataset' } };
function TestFiles({ files = testFiles, uuid = testUuid }) {
  const detailContext = useMemo(
    () => ({
      uuid,
      mapped_data_access_level,
    }),
    [uuid],
  );
  return (
    <FlaskDataContext.Provider value={flaskDataContext}>
      <DetailContext.Provider value={detailContext}>
        <Files files={files} />
      </DetailContext.Provider>
    </FlaskDataContext.Provider>
  );
}

const files = {
  get browser() {
    return screen.queryByTestId('file-browser');
  },
  targetFile: {
    get button() {
      return screen.getByRole('button', { name: 'fake5.txt' });
    },
    get link() {
      return screen.findByRole('link', { name: 'fake5.txt' });
    },
  },
  get duaCheckbox() {
    return screen.getByRole('checkbox');
  },
  get duaCheckboxByLabel() {
    return screen.getByLabelText('I have read and agree to the above data use guidelines.');
  },
  get duaCheckboxLabel() {
    return screen.queryByText('I have read and agree to the above data use guidelines.');
  },
  get duaDisagree() {
    return screen.getByRole('button', { name: 'Disagree' });
  },
  get duaAgree() {
    return screen.getByRole('button', { name: 'Agree' });
  },
};

test('handles DUA flow', async () => {
  const open = jest.fn();
  Object.defineProperty(window, 'open', { value: open });

  render(<TestFiles />);

  await userEvent.click(files.targetFile.button);
  expect(files.duaCheckboxByLabel).toBeInTheDocument();

  await userEvent.click(files.duaDisagree);
  await waitForElementToBeRemoved(() => files.duaCheckboxLabel);

  await userEvent.click(files.targetFile.button);
  await userEvent.click(files.duaCheckbox);
  await userEvent.click(files.duaAgree);

  expect(open).toHaveBeenCalled();

  await files.targetFile.link;
});

test('does not display file browser when files prop is undefined', async () => {
  render(<TestFiles files={[]} />);

  expect(files.browser).not.toBeInTheDocument();
});
