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
        '/browse/dataset/ca3016d836d8ee50bef1b93f339c9679#vitessce_conf_length=4174&vitessce_conf_version=0.0.1&vitessce_conf=N4Igxg9hBOAmCWA7AhgF3hRBlADssApiAFyixrIDOBqJoAgiSIwL4A0Ile6yANgFpQAtnWYkADADoAbACYAjAE5Fc6QHYALAA5Z0gKzL2nbvD4AlCKjQZEoxsXFGu1vgBVk0AOY0AGnZJ6elKKaoGyagDMWhEa0tLyTiZuHt6oAJr+xBryWpKyilqaivKRetIasokuvO5eNPyZ0nl64WrS4prSWt06BAC08hFGABYEaELIOIIQQn6kYg4jY6gTU8IZ8-aOHKPjk7WpcwwSS3s4BzQbx4schLy8AGLwvKgE0JmIAK73Rne8ABLwTzDXhA4a0TZMNryEC-Aj3LA0RG8AhgdCYTIAbUxIAA0n0ALJjRCUAAEmKJyEQAF1SQBRAAeOGgBEolBsIA4AGFeJ9KK9oKSYdS2Dj8ZSSeSJbTGczWeyMdzefy3qTZCARWLCcSyRTiTKmSy2RylXyBaSIhrRXjtVTddL6Yb5SaQDyzaqNFatRL7frHXLjYrXcrzXovTafVK-bKjQrbKaVYLpBrqXCETRAcDQcCIdcvj9bvDeIjUFyILwYFjQNxhiRvTqo1SDQG41bwOXK8RMV02PIlL21OI2LJAqm2NW0LWuxGG3qm-7Yy63YmhW3IBX3l2e33FAOhyO9GOJ6gp-W7Y2aQvnUHl+b1SL2xu64NpMPxBph1Fh6P2MfTzPzznS8Y2veNg3dQVLQfddO27LQ917PQIm-Q9fxAGs6wAyUgObRcbxDD01w7TdMRKXt+z0eQUKPdDJ0w8VZwdEDAzA29VTDaDiOfJDEOQyjqLQjDpwYwCmKdFjOXAldk04p8u1kBQ3w-HcBPHWiT3o21sLLAA3DxTEQQhcNAoi5Lg8jdxKfcfzUoSz20iA9OgAyjKvCSE3NYVbi4rd4JUqzVL-TTI0xXT9KpVzmNbDzVXvbyzJfJTP3gg8aLsrDdTC5yIoIYz3Kk80oPi2Dt0HXjAvU-8RIcpyXNytzooKwjZNgsiVP41LBLo4StMyxzwsM+qoqXAjBQ44qSPkHipr4qjOts7r7L62qcryxq2KTUzYIUub3wsir0uq3VXEsPg1o5FqSO3fsAvmoKepCk6rF4c78Ig1dLrra7LLKu7KuC2cnrOhqRveuLH1aiJX1kPbZC-P7Dt68kgZekG3pXIqIauvyypmg7Foy5HTtR4b0fNT1Pq7NqKLmmz7qWonnte1jRtJcase45C8Y6un-oewHieZySNtJGSJrrHakpUhGCaOi8+noe4+iwT4ACMzAITwbEoIXKfM-zft5xGQolBWlZV9XNe1oWYsFLyOd8-bbqN2WkaAs3eGVtWNa1zAdbRlmwa2yaoaSuGUpdjT+dE4kPa9y3fZJG2msg4Ovpxoc8ZlqOGfdxXPYtn3rYD4XWYp8WqbUfaedQhac8JvPze9q2-eTkX2Zgybpp4mu0tdk3Y-z+Oi9bkvbdFtP5MUmHlP7bOqrdrBhkmfoADVUVQGAdcn-WbsN2v6YbpeV76de0S36lS-e+3O-Tp3977+u5cxY+cDXjeL6vldwdvqnQ5n5K+Mn6L2Xm-U+H9oDb3HpjX++tcY8U6mOEA3hEAECeC8N4Hxvi8CMCgggmYQRglzAsfMOCOB4ORBvDkkJiCkNwQQVBpNEBlg3KsTI6FeBUAmLCchDCCBMJYTAVYZgqTeCxFIcQ+g2BSA0BEWu4AiyCOgHSQyEAECIE8Owv4JZKFog5FUHgvARGJgADLIAAJ5vEoFWEAqBzFvyYLQDgSBYAEAZBICabDaHYI4BAPAYB4B2JIFREAsAZjICQK4exRBiAgAJEgAA9ASZA7iOCoGgHaPALJEClh8qQ24y9ECoN4NYrsoBqAoj0RieYAAvAIaSPHgGCdsB2mIhzWUPBwHS8B2SqxRCQdJnwCAcEoKCVxk1ewaEUJImiFSqHVNAHU4gegGkOFuMEvQvwfJtJQtIh83Ten9OIIM4ZnAxmYPkhEQYbArnxHkLM+E8zbC1PqbYxpYASAaE2RXTEB5pHUS6T0+AfSYknJGeckiI5fryA6BoB5lT0TPMWa8iEQ4mnEBhlssyfy-niH2UCkFAzoBDPBfAcZEsdBVz7GUA+nBHlVKRSAJZKy3lrPRVcpwEK6w0pxhoNQih8WHNBcS05sC-nyFkPBPFaE5kMtEMy1ZaKPnEAiIoTlZKLmkTaFSkocjBXAqOWC1pOLAgCVTEg5whiuRFkoGYyxm5rigD8fgQJ5jGkZIQHyAIaKDkGuFSSzg6SIAAGsCCwCJUMlgBjTC8AJOWVE3xWR2ouXmbB0a+AADkCBglVjAYYUBYC2osSmkhaaODIFgAgRFfBrXplQKU1NBYQBCHjWARNBDszgiwT8Iw5ArDUHrXWUAAAzZ4rIh0gFHSiKJDjYl-EoJIAAVpQIMdjZ0KPuNYjgnxoC8CYOCVAOBKDEASQkqgA6F3DDVqsSAJIYDoE+EISQMBPAJLAMgCI4h5DSFgNEH9WgCAECCKrAgw75Cq0UBEYdERVVgBUPyhJEBPiHuQwAfWXZgBJZhxDiFkKhnwOG8NpBw2oSQ86l0rsQAAfk3qGxAABeHhI6x0zpiRuz2F6KOruiUwP4fQL2SR3Xu2JB6j0nrPWyGgl7r2TFvSu6AD6n0vrfR+r9-6oa-sA8B0D4HIPQdg-BxQiHkM4DQxhxAWHCP4as8RjoZGiz8ak1x6jtGGGMbQlOggrHeOjQXeZySa62NuJbDYPoEx0nwFSSAIT+7UCHuPae89Tmr2qxvX7e98BH3Pq8Cpz937f0aYA0B8QIGwMQagzBxQcH1BGaQyh1A6HKOWdw9ZlrtnSNgF885mjIa3NMcnSxnjsSMmJmc5JPxiKG0gHgBMbwpTMSgCEDQCtFBRAzC8-AYdw6ADyW2L0AFVd2xfi+JpL9bJApbS3ehTmWlM5ffXl9T-6tMlZ0+V-TVXDPGfq6hiAe2pPNbwwRtrJHn3-fO+ZnrdH3McBQEtpg2GWvA6IyRgLQ2QDrb6OgLbgmjsibi2JxLknzuXdk+lm7WXlMPbUwV57xXSu6YqwZmr33TOoASW49J+B2fBbwiSRDS2sebeHYD1rKO7PrckNj4dUO+ssAfJQMAowJjr0gdQkAEi8g8NsejkbApYQPjh2xrAAAFMwBJBNkqYKwB8rjFfORwIipgkkkCBKwFz14ng3WxOQMhiAklOHmLqxOyAQgcCYAYRCYw1RJKQBgOo6wmAsCQDflNvtVAaDW8kpamN0wRCxMYCMpIRjTpO4L9n4vFxUBzDEEX6oVeNi1+j4YqvDRy+FnuOg-X7f2MdqIVnjvxYkT0rL037RGYwSdqj4X9jJYlED+QXwvvOYF8UJH+rmfeCBHES8U3rf4k4xKOEaItjM+-hKJUZAdRmie85-MFQAUybIEL7v7wWtJSn8v+L3Gypiai32q-2qCzRzTzQLX-wuSbwrSrRsBrSLBLFKSbxbV-xRGXy7XLxGBIHghAAAHcSAq4QB3EVUOBvdthQBQ9w9UEckmA7cwAHcndvJ48kBE9sAU9x15h08B1ADDFjFH9i1n90CdgSBZAOBcCMUOBCCYViDmk0JyCI8qDYlA83gywcloBywUR3gGC4AmDEVk8-E2CyAKBODb9i8eC3gn8ECZ9X939wDNwm9X8f8E0UQbCuCY1gDgRc1oB801FnCBCQApwsDRDkICDGkSCZCZgKDI9eM4CpNY8oAtCUAdDWC09DDM8e9x9UBdFR8z9ojUBUDp9Y8cj580jFFiJL81EkAb9IDK1AkYC38ciLDtcpwWVRDhDgjiBJCQBvdvkyDwi5Co88Et12xGCEibBdDU9RAODUi98+Eu8IDN8l9J9+8e818EUN8Cj7gL9VFr8s8MDlkOBmQ-EpsVoQUi0QNeBtsdI3hnJXEmAqR0AUFtcWjxDmkpCbgeiw8+j91lg2FNCE9Ei9Dkj+0piZ9dgVhJg88a8QTvjwT1gF9QTVgq9ITJJ4T9gUhLgF8-hZjbDsj7g8iMScjMi1jB8Sw8Tii60ijpjUEsTV8FiswljKSCBCTqkGTt9WFJgaTGED8bAj9JgRENFT91i39SitiKiF8oCajMBYC60GjdiPx0JVCj1RAucSRw9qAI1TljinCzEziLiriNVbickgQGFHiXi2i0VvctB5dYdkB4dYlEcgcbNUcukrF1d5BJApAYQWAgA',
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
