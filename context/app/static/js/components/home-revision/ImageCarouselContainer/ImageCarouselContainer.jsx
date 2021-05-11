import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

import CarouselImage from 'js/components/home-revision/CarouselImage';
import VitessceSlide320w from 'portal-images/vitessce-slide-320w.png';
import VitessceSlide640w from 'portal-images/vitessce-slide-640w.png';
import VitessceSlide1280w from 'portal-images/vitessce-slide-1280w.png';
import VitessceSlide1392w from 'portal-images/vitessce-slide-1392w.png';
import AzimuthSlide320w from 'portal-images/azimuth-slide-320w.png';
import AzimuthSlide640w from 'portal-images/azimuth-slide-640w.png';
import AzimuthSlide1280w from 'portal-images/azimuth-slide-1280w.png';
import AzimuthSlide1392w from 'portal-images/azimuth-slide-1392w.png';
import CCFSlide320w from 'portal-images/ccf-slide-320w.png';
import CCFSlide640w from 'portal-images/ccf-slide-640w.png';
import CCFSlide1280w from 'portal-images/ccf-slide-1280w.png';
import CCFSlide1392w from 'portal-images/ccf-slide-1392w.png';

import ImageCarousel from '../ImageCarousel';
import ImageCarouselControlButtons from '../ImageCarouselControlButtons';
import ImageCarouselCallToAction from '../ImageCarouselCallToAction';
import { Flex, CallToActionWrapper } from './style';

const AnimatedFlex = animated(Flex);

function Animated({ children }) {
  const animation = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0.5 },
    config: { mass: 2, tension: 200, friction: 100 },
  });

  return <AnimatedFlex style={animation}>{children}</AnimatedFlex>;
}

function ImageCarouselContainer() {
  const slides = [
    {
      title: 'Explore spatial single-cell data with Vitessce visualizations',
      body:
        'View multi-modal assay types with reusable interactive components such as a scatterplot, spatial+imaging plot, genome browser tracks, statistical plots and controller components.',
      image: (
        <CarouselImage
          src320w={VitessceSlide320w}
          src640w={VitessceSlide640w}
          src1280w={VitessceSlide1280w}
          src1392w={VitessceSlide1392w}
          alt="Vitessce"
        />
      ),
    },
    {
      title: 'Navigate healthy human cells with the Common Coordinate Framework',
      body:
        'Interact with the human body data with the Anatomical Structures, Cell Types and Biomarkers (ASCT+B) Tables and CCF Ontology. Also explore two user interfaces: the Registration User Interface (RUI) for tissue data registration and Exploration User Interface (EUI) for semantic and spatial data.',
      image: (
        <CarouselImage
          src320w={CCFSlide320w}
          src640w={CCFSlide640w}
          src1280w={CCFSlide1280w}
          src1392w={CCFSlide1392w}
          alt="CCF Portal"
        />
      ),
    },
    {
      title: 'Analyze single-cell RNA-seq experiments with Azimuth',
      body:
        'Explore Azimuth, a web application that uses an annotated reference dataset to automate the processing, analysis and interpretation of new single-cell RNA-seq experiments.',
      image: (
        <CarouselImage
          src320w={AzimuthSlide320w}
          src640w={AzimuthSlide640w}
          src1280w={AzimuthSlide1280w}
          src1392w={AzimuthSlide1392w}
          alt="Azimuth"
        />
      ),
    },
  ];
  // Set random intial image index:
  const [selectedImageIndex, setSelectedImageIndex] = useState(Math.floor(Math.random() * slides.length));
  const { title, body } = slides[selectedImageIndex];

  return (
    <Animated key={selectedImageIndex}>
      <CallToActionWrapper>
        <ImageCarouselCallToAction title={title} body={body} />
        <ImageCarouselControlButtons
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          numImages={slides.length}
        />
      </CallToActionWrapper>
      <ImageCarousel
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        images={slides.map((slide) => slide.image)}
      />
    </Animated>
  );
}

export default ImageCarouselContainer;
