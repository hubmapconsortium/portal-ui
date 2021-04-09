import React from 'react';
import Typography from '@material-ui/core/Typography';

function ImageCarouselCallToAction({ selectedImageIndex }) {
  if (selectedImageIndex === 0) {
    return (
      <>
        <Typography variant="h3">Explore spatial single-cell data with Vitessce visualizations</Typography>
        <Typography variant="h6" component="p">
          View multi-modal assay types with reusable interactive components such as a scatterplot, spatial+imaging plot,
          genome browser tracks, statistical plots and controller components.
        </Typography>
      </>
    );
  }

  if (selectedImageIndex === 1) {
    return (
      <>
        <Typography variant="h3">Navigate healthy human cells with the Common Coordinate Framework</Typography>
        <Typography variant="h6" component="p">
          Interact with the human body data with the Anatomical Structures, Cell Types and Biomarkers (ASCT+B) Tables
          and CCF Ontology. Also explore two user interfaces: the Registration User Interface (RUI) for tissue data
          registration and Exploration User Interface (EUI) for semantic and spatial data.
        </Typography>
      </>
    );
  }
  return (
    <>
      <Typography variant="h3">Analyze single-cell RNA-seq experiments with Azimuth</Typography>
      <Typography variant="h6" component="p">
        Explore Azimuth, a web application that uses an annotated reference dataset to automate the processing, analysis
        and interpretation of new single-cell RNA-seq experiments.
      </Typography>
    </>
  );
}

export default ImageCarouselCallToAction;
