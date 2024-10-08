import React from 'react';

import metadata from 'test-utils/fixtures/dataProductMetadata';
import { render, screen } from 'test-utils/functions';

import { FlaskDataContext } from 'js/components/Contexts';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import { ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';
import DataProducts from './DataProducts';
import { flaskDataContext } from '../file-fixtures.spec';
import { ProcessedDatasetContextProvider } from '../../ProcessedData/ProcessedDataset/ProcessedDatasetContext';
import { ProcessedDatasetDetails } from '../../ProcessedData/ProcessedDataset/hooks';

const files = {
  get all() {
    return metadata.files;
  },
  get dataProducts() {
    return metadata.files.filter((file) => file.is_data_product);
  },
  get nonDataProducts() {
    return metadata.files.filter((file) => !file.is_data_product);
  },
};

const panel = {
  get container() {
    return screen.queryByTestId('data-products-container');
  },
  get dataProducts() {
    return screen.queryAllByTestId('data-product');
  },
};

const detailContext = {
  uuid: 'test-uuid',
  hubmap_id: 'test-hubmap-id',
  mapped_data_access_level: 'test-mapped-data-access-level',
};

const flaskDataContextEdited = { ...flaskDataContext, entity: { ...flaskDataContext.entity, metadata } };

function TestDataProducts({ files: passedFiles = files.all }) {
  return (
    <ProcessedDatasetContextProvider
      dataset={{ uuid: 'fakeuuid' } as unknown as ProcessedDatasetDetails}
      defaultExpanded
      sectionDataset={{ uuid: 'fakeparentuuid' } as unknown as ProcessedDatasetInfo}
    >
      <FlaskDataContext.Provider value={flaskDataContextEdited}>
        <DetailContext.Provider value={detailContext}>
          <DataProducts files={passedFiles} />
        </DetailContext.Provider>
      </FlaskDataContext.Provider>
    </ProcessedDatasetContextProvider>
  );
}

describe('DataProducts Panel Container', () => {
  it('renders when there are data products files in the list', () => {
    render(<TestDataProducts />);
    expect(panel.container).toBeInTheDocument();
    expect(panel.dataProducts).toHaveLength(files.dataProducts.length);
  });
  it('does not render when there are no data products files in the list', () => {
    render(<TestDataProducts files={files.nonDataProducts} />);
    expect(panel.container).not.toBeInTheDocument();
    expect(panel.dataProducts).toHaveLength(0);
  });
});
