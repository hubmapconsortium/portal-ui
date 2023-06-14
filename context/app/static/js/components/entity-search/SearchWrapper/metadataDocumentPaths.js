const donorMetadataPath = 'mapped_metadata';
const sampleMetdataPath = 'metadata';

const paths = {
  donor: {
    donor: donorMetadataPath,
  },
  sample: {
    sample: sampleMetdataPath,
    donor: `donor.${donorMetadataPath}`,
  },
  dataset: {
    donor: `donor.${donorMetadataPath}`,
    sample: `source_samples.${sampleMetdataPath}`,
    dataset: 'metadata.metadata',
  },
};

export { paths };
