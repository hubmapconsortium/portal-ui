import React from 'react';
import Typography from '@material-ui/core/Typography';

import Markdown from 'js/components/Markdown';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

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
        <Typography variant="h4" component="h2">
          Abstract
        </Typography>
        {abstract}
        <Typography variant="h4" component="h2">
          Manuscript
        </Typography>
        <b>{journal}</b>: <OutboundLink href={url}>{url}</OutboundLink>
        <Typography variant="h4" component="h2">
          Authors
        </Typography>
        {authors.long}
        <Typography variant="h4" component="h2">
          Contact
        </Typography>
        <b>Corresponding Author:</b>{' '}
        {authors.corresponding.map((author) => (
          <span key={author.name}>
            {author.name} -{' '}
            <EmailIconLink href={`${author.email}`} iconFontSize="1rem">
              {author.email}
            </EmailIconLink>
          </span>
        ))}
      </StyledPaper>
      {Boolean(vitessce_conf) && <VisualizationWrapper vitData={vitessce_conf} />}
      <Markdown markdown={markdown} />
    </>
  );
}

export default Publication;
