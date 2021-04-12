import React from 'react';
import Typography from '@material-ui/core/Typography';
import { StyledTypography } from './style';

const VitescceSlideText = {
  title: 'Explore spatial single-cell data with Vitessce visualizations',
  body:
    'View multi-modal assay types with reusable interactive components such as a scatterplot, spatial+imaging plot, genome browser tracks, statistical plots and controller components.',
};

const CCFSlideText = {
  title: 'Navigate healthy human cells with the Common Coordinate Framework',
  body:
    'Interact with the human body data with the Anatomical Structures, Cell Types and Biomarkers (ASCT+B) Tables and CCF Ontology. Also explore two user interfaces: the Registration User Interface (RUI) for tissue data registration and Exploration User Interface (EUI) for semantic and spatial data.',
};

const AzimuthSlideText = {
  title: 'Analyze single-cell RNA-seq experiments with Azimuth',
  body:
    'Explore Azimuth, a web application that uses an annotated reference dataset to automate the processing, analysis and interpretation of new single-cell RNA-seq experiments.',
};

const CallToActions = [VitescceSlideText, CCFSlideText, AzimuthSlideText];

function ImageCarouselCallToAction({ selectedImageIndex }) {
  return (
    <div>
      <StyledTypography variant="h3">{CallToActions[selectedImageIndex].title}</StyledTypography>
      <Typography variant="h6" component="p">
        {CallToActions[selectedImageIndex].body}
      </Typography>
    </div>
  );
}

export default ImageCarouselCallToAction;
