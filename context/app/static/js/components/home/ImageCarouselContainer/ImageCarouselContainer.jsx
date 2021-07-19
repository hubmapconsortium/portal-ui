import React, { useState } from 'react';

import CarouselImage from 'js/components/home/CarouselImage';

// Use the same sizes when adding a new image to the carousel
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
      buttonHref:
        '/browse/dataset/ca3016d836d8ee50bef1b93f339c9679#vitessce_conf_length=4229&vitessce_conf_version=0.0.1&vitessce_conf=N4Igxg9hBOAmCWA7AhgF3hRBlADssApiAFyixrIDOBqJoAgiSIwL4A0Ile6yANgFpQAtnWYkADADoAbACYAjAE5Fc6QHYALAA5Z0gKzL2nbvD4AlCKjQZEoxsXFGu1vgBVk0AOY0AGnZJ6elKKaoGyagDMWhEa0tLyTiZuHt6oAJr+xBryWpKyilqaivKRetIasokuvO5eNPyZ0nl64WrS4prSWt06BAC08hFGABYEaELIOIIQQn6kYg4jY6gTU8IZ8-aOHKPjk7WpcwwSS3s4BzQbx4schLy8AGLwvKgE0JmIAK73Rne8ABLwTzDXhA4a0TZMNryEC-Aj3LA0RG8AhgdCYTIAbUxIAA0n0ALJjRCUAAEmKJyEQAF1SQBRAAeOGgBEolBsIA4AGFeJ9KK9oKSYdS2Dj8ZSSeSJbTGczWeyMdzefy3qTZCARWLCcSyRTiTKmSy2RylXyBaSIhrRXjtVTddL6Yb5SaQDyzaqNFatRL7frHXLjYrXcrzXovTafVK-bKjQrbKaVYLpBrqXCETRAcDQcCIdcvj9bvDeIjUFyILwYFjQNxhiRvTqo1SDQG41bwOXK8RMV02PIlL21OI2LJAqm2NW0LWuxGG3qm-7Yy63YmhW3IBX3l2e33FAOhyO9GOJ6gp-W7Y2aQvnUHl+b1SL2xu64NpMPxBph1Fh6P2MfTzPzznS8Y2veNg3dQVLQfddO27LQ917PQIm-Q9fxAGs6wAyUgObRcbxDD01w7TdMRKXt+z0eQUKPdDJ0w8VZwdEDAzA29VTDaDiOfJDEOQyjqLQjDpwYwCmKdFjOXAldk04p8u1kBQ3w-HcBPHWiT3o21sLLAA3DxTEQQhcNAoi5Lg8jdxKfcfzUoSz20iA9OgAyjKvCSE3NYVbi4rd4JUqzVL-TTI0xXT9KpVzmNbDzVXvbyzJfJTP3gg8aLsrDdTC5yIoIYz3Kk80oPi2Dt0HXjAvU-8RIcpyXNytzooKwjZNgsiVP41LBLo4StMyxzwsM+qoqXAjBQ44qSPkHipr4qjOts7r7L62qcryxq2KTUzYIUub3wsir0uq3VXEsPg1o5FqSO3fsAvmoKepCk6rF4c78Ig1dLrra7LLKu7KuC2cnrOhqRveuLH1aiJX1kPbZC-P7Dt68kgZekG3pXIqIauvyypmg7Foy5HTtR4b0fNT1Pq7NqKLmmz7qWonnte1jRtJcase45C8Y6un-oewHieZySNtJGSJrrHakpUhGCaOi8+noe4+iwT4ACMzAITwbEoIXKfM-zft5xGQolBWlZV9XNe1oWYsFLyOd8-bbqN2WkaAs3eGVtWNa1zAdbRlmwa2yaoaSuGUpdjT+dE4kPa9y3fZJG2msg4Ovpxoc8ZlqOGfdxXPYtn3rYD4XWYp8WqbUfaedQhac8JvPze9q2-eTkX2Zgybpp4mu0tdk3Y-z+Oi9bkvbdFtP5MUmHlP7bOqrdrBhkmfoADVUVQGAdcn-WbsN2v6YbpeV76de0S36lS-e+3O-Tp3977+u5cxY+cDXjeL6vldwdvqnQ5n5K+Mn6L2Xm-U+H9oDb3HpjX++tcY8U6mOEA3hEAECeC8N4Hxvi8CMCgggmYQRglzAsfMOCOB4ORBvDkkJiCkNwQQVBpNEBlg3KsTI6FeBUAmLCchDCCBMJYTAVYZgqTeCxFIcQ+g2BSA0BEWu4AiyCOgHSQyEAECIE8Owv4JZKFog5FUHgvARGJgADLIAAJ5vEoFWEAqBzFvyYNAKgApJJIFgAQBkEgJpsNodgjgEA8BgHgHYkgVEQCwBmMgJArh7FEGICAAkSAAD0BJkCeI4KgJxJI8AskQKWHypDbjL0QKg3g1iuygGoCiPRGJ5gAC8AgZK8eAUJ2wHaYiHNZQ8HAdLwHZKrFEJBMmfAIBwSgoJ3GTV7BoRQkiaJVKobU0ADTiB6CaQ4W4oS9C-B8h0lC0iHy9P6YM4gwzRmcAmZg+SERBhsBufEeQ8z4SLNsPUxptjmlgBIBobZFdMQHmkdRHpfT4ADLiWcsZlySIjl+vIDoGgnnVPRK85Z7yIRDhacQGGOyzIAoBeIQ5IKwVDOgCMyF8BJkSx0FXPsZQD6cGeTUlFIAVlrI+RszFNynBQrrHSnGGg1CKEJcc8FpLzmwIBfIWQ8ECVoQWUy0QrL1kYq+cQCIihuUUquaRNoNKShyOFaCk5EL2l4sCAJVMSDnCGK5EWSgZjLGbmuKAAJ+BgnmOaU4hAfIAgYqOUa0VZLOCZIgAAawILAElIyWAGNMLwAk5ZUTfFZA6q5eZsGxr4AAOQIGCVWMBhhQFgPaixaaSEZo4MgWACBkV8FtemVA5T00FhAEIRNYBk0EOzOCLBPwjDkCsNQRtdZQAADNnishHSAcdKIYkOPiX8SgkgABWlAgx2PnQo+41iOCfGgLwJg4JUA4EoMQJJSSqBDqXcMNWqxIAkhgOgT4QhJAwE8EksAyAIjiHkNIWA0Q-1aAIAQIIqsCCjvkKrRQERR0RHVWAFQgqkkQE+Me1DAB9VdmAklmHEOIWQ6GfB4YI2kPDahJCLpXWuxAAB+Te4bEAAF4eFjonXOuJW7PZXqo+u2JTA-h9CvZJPdB74lHpPWei9bIaDXtvZMe9a7oBPpfW+j9X6f2Aahv+4DoHwOQeg7B+DiHFDIdQzgDDWHEA4eI4RmzpGOgUaLIJmTPHaP0YYcxtCM6CDsf46NJdlnJIbo4x4lsNg+gTEyfAdJIAROHtQMe0957L0uZvarO9ftH3wGfa+rwanv2-v-VpoDIHxBgYg1BmDcHFAIfUCZlDaHUCYeo9Z-Dtm2v2fI2Afzrm6Nho8yx6dbG+PxKcYmVzkkAnIqbSAeAExvDlMxKAIQNAq0UFEDMHz8BR2joAPI7avQAVX3fFxLkmUuNskGljLD6lPZZU3lz9BXNOAZ02VvTlXDM1eM6Zxr6GIAHZk61gjRGOtkdfYDy7lm+sMeYxwPpAAhYJExKChpIKOvg1AjAoBW0wXDbXQckbI0FkbIBNt9HQDt4TJ2xMJYk8l6Tl3rvycy3dnLqmnsaaK690r5X9MwcAGQESSPGZPwKgYX4k4yUGQytin23R3A-a0Thzm3JCU9HTDgbLAHyUDAKMCY69IHUJABIvIPDbGk7Gy47XHAcccawAABTMASYTFKmCsAfO43XzkcDIqYK4xAwSsCi9eJ4D18TkCoYgJJTh5iGtTsgEIHAmAGEQmMNUSSkAYDqOsJgLAkA34zYHVQGg7vJLWrjdMEQ8TGBjKSEY06fua-l-rxcVAcwxB1+qG3jYnf0+GLbw0ZvhZ7joJccPzjXaiFl5H8WJEjKm99+0RmME3a0+184yWJRM-kF8KnzmHfFCF-G433ggRxEfF97P5LmwSjhGiI4xvv4SiVGQHUZoifFfzDOLeKmyBO+v9eB60yk-8AD68E1qlk0S1HUwDqgc080C0i1oCrk+8q0a0bA60iwSxyk+821ICUR98e1m8RgSB4IQAAB3EgKuEATxNVDgcPbYUARPZPVBPJJgL3MAH3P3bybPJAXPbAAvSdeYYvIdWAwxYxAUP-HA1gHYEgWQDgSgrFDgWguFeg1pNCZglPNg+JWPN4MsPJaAcsFEd4DgZkAJIvPpZAMFCISNacfHEHOzYnJBLPOAPg5FfPAJIQsgCgUQz-evCQ3-Utf-Pw6oYA5AzcPvQAiApNFEcIsQuNeA4EfNaAQtNROI4g2Q4gMgxQ5CGg5pBgjQmYFg1PfjLAmTTPKAVwlAdwwQovHw0vCfZfVAXRRfJ-Mo1AQg9fTPdo7fRoxRYiV-NRJAD-VA6tYJDAoA9o6Q83KcNlRQ+QvI4gVQkAcPX5JgoorQtPPBHddsXg6omwDwwvUQEQhoq-PhMfFA0-PfVfafCfI-JFE-bo+4F-VRd-MvEg1ZUwwwk9UQFaMFEtMDXgXbHSN4ZydxJgKkdAFBc3eY5Q1pNQm4dYpPTYw9ZYNhHgqo-gw4rw8JeoronYNEyYKvDvDfXYFYIk9YHfMk1YNvEkySak-YFIS4HfP4C4iIto+4Tolk9olox42fEsLkvohtXos41BNkw-a4rMW40UggXk2pGU8-VhSYCUxhG-TAO-SYERDRR-J4oAgY144YnfNA8YzATAhtaYj4j8dCb4mbUXbJCAagKNc5P42IsxQE4E0ErVCEvJIEBhGE+ExYjFcPLQG3EAO3PHGzQndDTrSSEEo3eU+QSQKQGEFgIAA',
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
      buttonHref: 'https://hubmapconsortium.github.io/ccf/',
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
      buttonHref: 'https://azimuth.hubmapconsortium.org/',
    },
  ];
  // Set random intial image index:
  const [selectedImageIndex, setSelectedImageIndex] = useState(Math.floor(Math.random() * slides.length));
  const { title, body, buttonHref } = slides[selectedImageIndex];
  return (
    <Flex>
      <CallToActionWrapper>
        <ImageCarouselCallToAction title={title} body={body} buttonHref={buttonHref} />
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
    </Flex>
  );
}

export default ImageCarouselContainer;
