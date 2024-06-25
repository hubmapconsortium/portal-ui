interface IconProps {
  src: string;
  alt: string;
}

const nih: IconProps = {
  src: `${CDN_URL}/v2/icons/nih_common_fund.png`,
  alt: 'NIH Logo',
};
const protocols: IconProps = {
  src: `${CDN_URL}/v2/icons/protocols.png`,
  alt: 'Protocols.io Logo',
};

const googleScholar: IconProps = {
  src: `${CDN_URL}/v2/icons/google_scholar.png`,
  alt: 'Google Scholar Logo',
};

const hra: IconProps = {
  src: `${CDN_URL}/v2/icons/hra_icon.png`,
  alt: 'Human Reference Atlas Logo',
};

const azimuth: IconProps = {
  src: `${CDN_URL}/v2/icons/azimuth.png`,
  alt: 'A miniature scatterplot visualization.',
};

const fusion: IconProps = {
  src: `${CDN_URL}/v2/icons/fusion.png`,
  alt: 'FUSION Logo',
};

const avr: IconProps = {
  src: `${CDN_URL}/v2/icons/antibody_validation_reports.png`,
  alt: 'Antibody Validation Reports Logo',
};

const hubmapConsortium: IconProps = {
  src: `${CDN_URL}/v2/icons/hubmap_consortium.png`,
  alt: 'HuBMAP Consortium Logo',
};

const dataPortal: IconProps = {
  src: `${CDN_URL}/v2/icons/dataportal_icon.png`,
  alt: 'Data Portal Logo',
};

export { nih, protocols, googleScholar, hra, azimuth, fusion, avr, hubmapConsortium, dataPortal };
