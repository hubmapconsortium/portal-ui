import React from 'react';
import { render, screen, appProviderEndpoints, appProviderToken } from 'test-utils/functions';

import { DetailContext } from 'js/components/detailPage/DetailContext';

import { ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';
import { FilesContext } from '../FilesContext';

import FileBrowserFile from './FileBrowserFile';
import { detailContext, filesContext, uuid } from '../file-fixtures.spec';
import { ProcessedDatasetContextProvider } from '../../ProcessedData/ProcessedDataset/ProcessedDatasetContext';
import { ProcessedDatasetDetails } from '../../ProcessedData/ProcessedDataset/hooks';

const defaultFileObject = {
  rel_path: 'fakepath',
  edam_term: 'faketerm',
  description: 'fakedescription',
  file: 'fakefile',
  size: 1000,
  is_qa_qc: false,
  mapped_description: 'fakemappeddescription',
  type: 'faketype',
};

function RenderFileTest({ fileObjOverrides = {}, depth = 0 }) {
  const completeFileObject = {
    ...defaultFileObject,
    ...fileObjOverrides,
  };
  return (
    <ProcessedDatasetContextProvider
      dataset={{ uuid: 'fakeuuid' } as unknown as ProcessedDatasetDetails}
      defaultExpanded
      sectionDataset={{ uuid: 'fakeparentuuid' } as unknown as ProcessedDatasetInfo}
    >
      <DetailContext.Provider value={detailContext}>
        <FilesContext.Provider value={filesContext}>
          <FileBrowserFile fileObj={completeFileObject} depth={depth} />
        </FilesContext.Provider>
      </DetailContext.Provider>
    </ProcessedDatasetContextProvider>
  );
}

const file = {
  get qaChip() {
    return screen.queryByText('QA');
  },
  get dataProductChip() {
    return screen.queryByText('Data Product');
  },
  get link() {
    return screen.getByRole('link');
  },
  get container() {
    return screen.getByTestId('file-indented-div');
  },
};

describe('FileBrowserFile', () => {
  it('displays a link with correct href when dua is agreed to', () => {
    render(<RenderFileTest />);

    const refToTest = `${appProviderEndpoints.assetsEndpoint}/${uuid}/${defaultFileObject.rel_path}?token=${appProviderToken}`;

    expect(file.link).toHaveAttribute('href', refToTest);
  });

  it('has correct left margin', () => {
    const depth = 3;

    render(<RenderFileTest depth={depth} />);

    // depth * indentation multiplier * 8px spacing unit
    const expectedMargin = depth * 4 * 8;
    expect(file.container).toHaveStyle(`margin-left: ${expectedMargin}px`);
  });

  it('displays QA chip when is_qa_qc is true', () => {
    render(<RenderFileTest fileObjOverrides={{ is_qa_qc: true }} />);

    expect(file.qaChip).toBeInTheDocument();
  });

  it('does not display QA chip when is_qa_qc is not provided', () => {
    render(<RenderFileTest />);

    expect(file.qaChip).not.toBeInTheDocument();
  });

  it('does not display QA chip when is_qa_qc is false', () => {
    render(<RenderFileTest fileObjOverrides={{ is_qa_qc: false }} />);

    expect(file.qaChip).not.toBeInTheDocument();
  });

  it('displays Data Product chip when is_data_product is true', () => {
    render(<RenderFileTest fileObjOverrides={{ is_data_product: true }} />);

    expect(file.dataProductChip).toBeInTheDocument();
  });

  it('does not display Data Product chip when is_data_product is false', () => {
    render(<RenderFileTest fileObjOverrides={{ is_data_product: false }} />);

    expect(file.dataProductChip).not.toBeInTheDocument();
  });

  it('does not display Data Product chip when is_data_product is not provided', () => {
    render(<RenderFileTest />);

    expect(file.dataProductChip).not.toBeInTheDocument();
  });

  it('displays "QA" and "Data Product" chips when is_qa_qc and is_data_product are true', () => {
    render(<RenderFileTest fileObjOverrides={{ is_qa_qc: true, is_data_product: true }} />);

    expect(file.qaChip).toBeInTheDocument();
    expect(file.dataProductChip).toBeInTheDocument();
  });
});
