import React from 'react';

import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import GlobusLink from '../GlobusLink';
import FileBrowser from '../FileBrowser';

function Files(props) {
  const { files, entityEndpoint, uuid, display_doi } = props;
  return (
    <SectionContainer id="files">
      <SectionHeader>Files</SectionHeader>
      {files && <FileBrowser files={files} />}
      <GlobusLink entityEndpoint={entityEndpoint} uuid={uuid} display_doi={display_doi} />
    </SectionContainer>
  );
}

export default Files;
