import React from 'react';
import Typography from '@material-ui/core/Typography';

import Markdown from 'js/components/Markdown';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { StyledPaper } from './style';

function Publication(props) {
  const { metadata, markdown } = props;
  const { vitessce_conf, title, authors, manuscript, abstract } = metadata;
  const { journal, url } = manuscript;

  return (
    <>
      <Typography variant="subtitle1">Publication</Typography>
      <SectionHeader variant="h1" component="h1">
        {title}
      </SectionHeader>
      <StyledPaper>
        <Typography variant="h3" component="h3">
          Abstract
        </Typography>
        {abstract}
        <Typography variant="h3" component="h3">
          Manuscript
        </Typography>
        <b>{journal}</b>: <a href={url}>{url}</a> {/* remove protocol */}
        <Typography variant="h3" component="h3">
          Authors
        </Typography>
        {authors.long}
        <Typography variant="h3" component="h3">
          Contact
        </Typography>
        <b>Corresponding Author:</b>{' '}
        {authors.corresponding.map((author) => (
          <>
            {author.name} - <a href={`mailto:${author.email}`}>{author.email}</a>
          </>
        ))}
      </StyledPaper>
      {Boolean(vitessce_conf) && <VisualizationWrapper vitData={vitessce_conf} />}
      <Markdown markdown={markdown} />
    </>
  );
}

export default Publication;
