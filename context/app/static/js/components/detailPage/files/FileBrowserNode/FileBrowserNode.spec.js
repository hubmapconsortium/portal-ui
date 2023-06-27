/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import DetailContext from 'js/components/detailPage/context';
import FileBrowserNode from './FileBrowserNode';
import FilesContext from '../Files/context';

const fakeOpenDUA = jest.fn();

const uuid = 'fakeuuid';

const detailContext = { uuid };
const filesContext = { openDUA: fakeOpenDUA, hasAgreedToDUA: 'fakedua' };

function FilesProviders({ children }) {
  return (
    <DetailContext.Provider value={detailContext}>
      <FilesContext.Provider value={filesContext}>{children}</FilesContext.Provider>
    </DetailContext.Provider>
  );
}

function FakeFileObject(i) {
  this.rel_path = `fakepath${i}`;
  this.edam_term = `faketerm${i}`;
  this.description = `fakedescription${i}`;
  this.file = `fakefile${i}`;
  this.size = 1000;
}

test('displays a link with correct href when dua is agreed to', () => {
  const fileSubTree = {
    files: [new FakeFileObject(1), new FakeFileObject(2)],
    'fakedirpath1/': { files: [new FakeFileObject(3)] },
  };
  const depth = 0;
  render(
    <FilesProviders>
      <FileBrowserNode fileSubTree={fileSubTree} depth={depth} />
    </FilesProviders>,
  );

  expect(screen.getAllByRole('link')).toHaveLength(2);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
