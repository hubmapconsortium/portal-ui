import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved, appProviderEndpoints } from 'test-utils/functions';
import { DefaultBodyType, http, PathParams, HttpResponse, RequestHandler } from 'msw';
import { setupServer } from 'msw/node';

import { FlaskDataContext } from 'js/components/Contexts';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import Files from './Files';
import { detailContext, flaskDataContext, testFiles, uuid as testUuid } from '../file-fixtures.spec';
import { FilesContextProvider } from '../FilesContext';

const globusHandler: RequestHandler = http.get<PathParams, DefaultBodyType, { url: string }>(
  `/${appProviderEndpoints.entityEndpoint}/entities/dataset/globus-url/${testUuid}`,
  () => {
    return HttpResponse.json({
      url: 'fakeglobusurl',
    });
  },
);

const server = setupServer(globusHandler);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function TestFiles({ files = testFiles }) {
  return (
    <FlaskDataContext.Provider value={flaskDataContext}>
      <DetailContext.Provider value={detailContext}>
        <FilesContextProvider>
          <Files files={files} />
        </FilesContextProvider>
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

test('does not display file browser when files prop is undefined', () => {
  render(<TestFiles files={[]} />);

  expect(files.browser).not.toBeInTheDocument();
});
