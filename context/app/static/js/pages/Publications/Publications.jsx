import React from 'react';
import Typography from '@material-ui/core/Typography';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Publication(props) {
  const { titles } = props;

  return (
    <>
      <SectionContainer id="summary">
        <Typography variant="subtitle1">Publications?</Typography>
        <SectionHeader variant="h1" component="h1">
          Publications!
        </SectionHeader>
        <ul>
          {Object.entries(titles).map(([path, title]) => (
            <li key={path}>
              <a href={`publication/${path}`}>{title}</a>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </>
  );
}

export default Publication;
