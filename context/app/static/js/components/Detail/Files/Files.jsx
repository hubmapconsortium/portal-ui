import React from 'react';

import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import GlobusLink from '../GlobusLink';
import FileBrowser from '../FileBrowser';

function Files(props) {
  const { files, entityEndpoint, uuid } = props;
  return (
    <SectionContainer id="files">
      <SectionHeader>Files</SectionHeader>
      {files && <FileBrowser files={files} />}
      <GlobusLink entityEndpoint={entityEndpoint} uuid={uuid} fileBrowserDisplayed={files !== undefined} />
    </SectionContainer>
  );
}

export default Files;
