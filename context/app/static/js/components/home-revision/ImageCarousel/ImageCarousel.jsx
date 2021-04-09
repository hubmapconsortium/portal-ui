import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import VitessceSlide640w from 'images/vitessce-slide-640w.png';
import VitessceSlide800w from 'images/vitessce-slide-800w.png';
import VitessceSlide1024w from 'images/vitessce-slide-1024w.png';
import VitessceSlide1280w from 'images/vitessce-slide-1280w.png';
import VitessceSlide1392w from 'images/vitessce-slide-1392w.png';
import AzimuthSlide640w from 'images/azimuth-slide-640w.png';
import AzimuthSlide800w from 'images/azimuth-slide-800w.png';
import AzimuthSlide1024w from 'images/azimuth-slide-1024w.png';
import AzimuthSlide1280w from 'images/azimuth-slide-1280w.png';
import AzimuthSlide1392w from 'images/azimuth-slide-1392w.png';
import CCFSlide640w from 'images/ccf-slide-640w.png';
import CCFSlide800w from 'images/ccf-slide-800w.png';
import CCFSlide1024w from 'images/ccf-slide-1024w.png';
import CCFSlide1280w from 'images/ccf-slide-1280w.png';
import CCFSlide1392w from 'images/ccf-slide-1392w.png';

function ImageCarousel({ selectedImageIndex }) {
  return (
    <Carousel showThumbs={false} showStatus={false} selectedItem={selectedImageIndex}>
      <div>
        <img
          srcSet={`${VitessceSlide640w} 640w,
          ${VitessceSlide800w} 800w,${VitessceSlide1024w} 1024w,
        ${VitessceSlide1280w} 1280w,
        ${VitessceSlide1392w} 1392w`}
          alt="CCF Portal"
        />
      </div>
      <div>
        <img
          srcSet={`${AzimuthSlide640w} 640w,
          ${AzimuthSlide800w} 800w,${AzimuthSlide1024w} 1024w,
        ${AzimuthSlide1280w} 1280w,
        ${AzimuthSlide1392w} 1392w`}
          alt="Azimuth Tool"
        />
      </div>
      <div>
        <img
          srcSet={`${CCFSlide640w} 640w,
          ${CCFSlide800w} 800w,${CCFSlide1024w} 1024w,
        ${CCFSlide1280w} 1280w,
        ${CCFSlide1392w} 1392w`}
          alt="CCF Portal"
        />
      </div>
    </Carousel>
  );
}

export default ImageCarousel;
