import React from 'react';

import { LightBlueLink } from 'shared-styles/Links';

function DagProvLink(props) {
  const { data } = props;

  const trimmedOrigin = data.origin.split('.').slice(0, -1).join('.');
  const githubUrl =
    'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;
  return (
    <>
      <LightBlueLink href={githubUrl} target="_blank" rel="noopener noreferrer">
        {githubUrl}
      </LightBlueLink>
      {'name' in data && (
        <LightBlueLink href={cwlUrl} target="_blank" rel="noopener noreferrer">
          {cwlUrl}
        </LightBlueLink>
      )}
    </>
  );
}

export default DagProvLink;
