import React from 'react';
// import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { FlexPaper } from './style';

function Citation({ contributors, title, timestamp, url }) {
  const firstContributors = contributors
    .slice(0, 6)
    .map(({ last_name, first_name }) => `${last_name} ${first_name[0]}`);
  if (firstContributors.length < contributors.length) {
    firstContributors.push('et al');
  }
  const year = new Date(timestamp).getFullYear();
  return (
    <SectionContainer id="citation">
      <SectionHeader>Citation</SectionHeader>
      <FlexPaper>
        {firstContributors.join(', ')}. {title} [Internet]. HuBMAP Consortium {year}. Available from:{' '}
        <LightBlueLink href={url}>{url}</LightBlueLink>
      </FlexPaper>
    </SectionContainer>
  );
}

export default Citation;
