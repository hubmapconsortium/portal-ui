import React, { PropsWithChildren } from 'react';
import { render, screen } from 'test-utils/functions';

import { DetailContext } from 'js/components/detailPage/DetailContext';
import FileBrowserNode from './FileBrowserNode';
import { FilesContext } from '../FilesContext';
import { DatasetFile, FileTree } from '../types';
import { detailContext, filesContext } from '../file-fixtures.spec';

function FilesProviders({ children }: PropsWithChildren) {
  return (
    <DetailContext.Provider value={detailContext}>
      <FilesContext.Provider value={filesContext}>{children}</FilesContext.Provider>
    </DetailContext.Provider>
  );
}

function FakeFileObject(i: number): DatasetFile {
  return {
    rel_path: `fakepath${i}`,
    edam_term: `faketerm${i}`,
    description: `fakedescription${i}`,
    file: `fakefile${i}`,
    size: 1000,
    is_qa_qc: false,
    is_data_product: false,
    mapped_description: `fakemappeddescription${i}`,
    type: `faketype${i}`,
  };
}

test('displays a link with correct href when dua is agreed to', () => {
  const fileSubTree: FileTree = {
    files: [FakeFileObject(1), FakeFileObject(2)],
    // @ts-expect-error TS does not handle this case well
    'fakedirpath1/': {
      files: [FakeFileObject(3)],
    },
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
