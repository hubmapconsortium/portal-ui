import { BulkDownloadDataset } from 'js/stores/useBulkDownloadStore';

export const ALL_BULK_DOWNLOAD_OPTIONS: {
  key: string;
  label: string;
  isIncluded: (dataset: BulkDownloadDataset) => boolean;
}[] = [
  {
    key: 'raw',
    label: 'raw',
    isIncluded: (dataset: BulkDownloadDataset) => dataset.processing === 'raw',
  },
  {
    key: 'central',
    label: 'HuBMAP centrally processed',
    isIncluded: (dataset: BulkDownloadDataset) => dataset.processing_type === 'hubmap',
  },
  {
    key: 'external',
    label: 'lab or externally processed',
    isIncluded: (dataset: BulkDownloadDataset) =>
      dataset.processing === 'processed' && dataset.processing_type !== 'hubmap',
  },
];

export const LINKS = {
  // TODO: Update tutorial link once created
  tutorial: '/tutorials',
  installation: 'https://docs.hubmapconsortium.org/clt/install-hubmap-clt.html',
  documentation: 'https://docs.hubmapconsortium.org/clt/index.html',
};

export const PAGES = [
  // TODO: uncomment once tutorial is created
  // {
  //   link: links.tutorial,
  //   children: 'Tutorial',
  // },
  {
    link: LINKS.installation,
    children: 'HuBMAP CLT Installation',
    external: true,
  },
  {
    link: LINKS.documentation,
    children: 'HuBMAP CLT Documentation',
    external: true,
  },
];
