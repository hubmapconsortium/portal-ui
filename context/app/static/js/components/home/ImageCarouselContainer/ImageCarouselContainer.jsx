import React, { useState } from 'react';

import CarouselImage from 'js/components/home/CarouselImage';

import ImageCarousel from '../ImageCarousel';
import ImageCarouselControlButtons from '../ImageCarouselControlButtons';
import ImageCarouselCallToAction from '../ImageCarouselCallToAction';
import { Flex, CallToActionWrapper } from './style';
import { getCarouselImageSrcSet } from './utils';

const getCDNCarouselImageSrcSet = (key) => getCarouselImageSrcSet(key, CDN_URL);

function ImageCarouselContainer() {
  const slides = [
    {
      title: 'Explore spatial single-cell data with Vitessce visualizations',
      body: 'View multi-modal single-cell resolution measurements with reusable interactive components such as a scatterplot, spatial+imaging plot, genome browser tracks, statistical plots, and controller components.',
      image: <CarouselImage {...getCDNCarouselImageSrcSet('vitessce-2')} alt="Vitessce" key="Vitessce" />,
      buttonHref:
        '/browse/dataset/69d9c52bc9edb625b496cecb623ec081#vitessce_conf_length=5973&vitessce_conf_version=0.0.1&vitessce_conf=N4Igxg9hBOAmCWA7AhgF3hRBlADssApiAFyixrIDOBqJoAgiSIwL4A0IBAtgEYGwJEAcwAqATxxFSzJqgC0WAHIBREOxAQelcZLozi4AgBsjajgDMCaAK7QCOqQyZCCiIuss27ANWRHr9hKO+pwAHjh2lJQYiGacvPyCQgBaUFx6jMQATABsAHRZAJw5WQAMABwAzADsACyFdaWF6tx8AkhCAEoQqGgxGSSlLQntwiLI0C6oABoDxHKVeU0AjA2V9YWbW+UArARy1cNtSeOTNACac3I7eTm1teW1NRtbm-uHHK2JHadTyXNDT4jJIAeS0WBoAAUIEYxEJMJRvPBojwjMFMuY-NQjt9hGDKBDUAAZZB8IyI5HwVHokiY8kEHGjIT4wkkslYeAALxpxGWtUZoK0nWQCGslDmywFHXxwtFlAAshBYDyQMhrKgIHEvkz8SC8GB4KgxBKpXitHr8IaxIrlXNVerNepKHh0H5UhB0tJMnJanlNllljtSllqqVKoUdk8djsnS74H5ur10JgAbG+n5fjRZl6SLVquVlnlKqUdgWsjtKuVipKOM700ZM6hLjniA9S3knoU+dUA7l7jHa3GMxM-nNENYTGnXUZE31MNmnMRx5PB-XZ8nEM3F8ujFP4zOenPEP8Wzu9wnDxuQdAeIbU6vp9fb6h6KFkWOJ7uH-vX8iAGLwKE-BzHS2IcAAFlYqBcMgODulwC76ICICQWgMFwWkW5IeoqHQbBjaIZkyG4ehjZYUR6iaJQAFGKgBDQB+K4aFoAAS8BCOBRjseBtCnp+lHgjQEJomAG5zAA2uJIAAMLGEYAAEADScjylYiCUPJ4moEoygAPr0CYul-lBtgEJQAC6IAcMsIDmWwUmySYSkqWpGlaTp+mGcZXhmZZHBZLZ9kyXJzmqcg6madpKieUYRkmZEfkgJUtnmQJBI0GxHFcRxvHbvxHBUYS0kwjAEmgC64EkA5IXKWFEXudFBmxd5qCmRZgXgCVDHEOJOTlGwyyrANoapWw5VoJVPXBU5tWuZFHlNXFPntdZHWQEYpU9X1A1DcsI3sONqCTdVM0ueFblRXpi0tW1iUBXZnUbd14nLJUORsGUtQfZWo2Hcd00KbN53zY1Xnxb5VlJWtXVVdte2lANFa-SAFVVQDoVzeJdVyE1CjWDwnQEEIMQWfJyjhJE0Qpg962bb1-WDYUw2lMjqNTY5gNnfV2O41g+OE8TCLmWTFNmVTsSrTTMNbQzu37WNKMTWjHMY8DWNqTjJh4wTRMk8L5MRGL-T+dDT1Va972fd95Ss0r7M1Vzbk81rfM64L6n66LUTG1DUtmzLzOI5UttHcrDt1U7ame4b3vUxwtPPXDcsswdiuh-bp0R5pdXR5TPs2X7dNJ0z8Mh-9KtA9zUcizH4uQ-d8fSy9b0faUX1ZD9qdsydnNZ+r4W50bKYcMlheJwzoZB2XYeZ5jWDgbB+zeAQokwO1Y+w7LJfy39M+93PC+SHIy+r9AK0gAXjf+-TO3bynCvd+jldufPi-HyvGpn3dpt0xbrft53B+dse6q3qq-I+J9P7n1HlfIuE8EaBmDl3YBT9HaaREAQUIrU7CWQ3gHRmzNp4Z33mrDBWDTKJUvo9OBt9CHIPTiA5+6DDxGEHrHWIeCb4ENLvQ8u4dMYiBYWwuuktYHj1oTwoBDDUF90Eb0VhNc87DxAA3ahz0-5Ww7jbXhe9QFuTkX4YRPsYFqM3oHRBRDGFoPEsVAAbhMeMiBCBGLjqY-BydLEyMxnYhx4VnGKKHhLC+P9xHcJ3mnPhs81Y+OgI4-xBslFBNUQnc2LdNGAN3sQvRmkYlxIIC4oJJiUn4MnhYlgo0QCeGwQQGidFup5SYlU0ymVOLcVyvoM8FhwbCQ-v0FsDkAAiZRbIeHBr4fwBBipPXQnaHARgqAwTiE0nwfgAhTJgOhYUwgeTiQRqUAo5YKlUXWdAZQTilQdDtC4NwPTRL9HPEYAAkjBFwJIxD0TKiAI0ugDDQCoHUyGSBlShEGBwWxlJqQkFQNAAIYiZlLk-AVfUVoSDLA4LAD0yAkAOCYPKJAAB6eUyAQUcGhedPAdhECoBOSQHcHBKXKlicIG0UhmDtHQLYogHAxQEEqLAWkWICDxwXogNw5IqqgGoCJMS0hOSgq+fKsAJAyjqGKeJcsOwPrRi1TsB64KURoihTCoVIBKBcUZVVdYmrQzLG0QrKVvSUyyvlbxBG4ASA5FVU3BGGq2AszBRCw1xBoWwtNeaj5PVXpZHKNUNgORoyVF1anB1dynWgDlcQN1rr44kAHG49V2qfXRj1YGqQIaTVmvgBayNVQ2DVEKLUe+krjCOtiM6zNpLFXKs9WIqqeydUloNWW41tZw3qLzIjcoORUrI2+ay58MFKAAGtAWIGBaigNQ6jWhoTvCulGhkVGg3SADFMFsVBFxQSolJKvl-PUhS1w1LvV+r9Q9Bl9EOgsqYPQdl8BOWQx5XygV9JhXhTFeKHqzbpV9NAEqjtCr4MZuQmq-tGrB1UiDaBCtY6qpZCyANJ45QKjIxTTK2Dx7s0gCQ166+RbNX+pAPqjDw7Q2VurS9Uosa+Q1ByNO5NLbU1tvI9kTtiHBg0bpr6uj6HIXECw6OqtEaXq5AI+GPDJGBNkfdcQSoom3XUd7T1X1UmZOYcFQp9je1VN1EKDO8pDyIRCC4I+o8byI2LlABAQ9xpeT0pFPAMUua3VMdk+W2s0KIBLuAnJwVLAHnQiQMSZA7z6kdPyqaocRhFAEG4jwGA4EoCwDc6lzInTVS-swH4FkNAIMNK-CALgMIV4TgIC07KPFGK7nUOQXo1BUAQfEqAcw8A0QDaGyNwIPzVSip68gOQhATCUDyJyCYDEkUblq5U-AUC0ZUXxRXaxl0YpLWqefPbB2+7OyMNrAWesAnsMhud-hasc73ZEcxSg+3ntgMPkvD+a9EpPaifVMh1TAdaC+8D-RQi3s+yByQ+quS-H5Nh649COAOibfkDpPQCAuADYQQ9KLPmPtcHxf1twah1ChBJ1RMnNO4hzqYAt8V3LoCmAMDxVAOBKDEHxfiqgfWlvgXxuhSA6kYDoGsFwPIMAhD4pyIUWAhQwA7CyDwMAhR+A8BKDsHg9QciEDADrjuK8KjLAFzNigcgVvQGgPiuwQhSilGWLpTBEQ5Bgdm8t1bZhxtohxQYL31uWdyCFz7u3j2cAbYlSAIQ0AIDWBwIoZAzmmAXcxkd664Nz59ZT2ngw8PskNSumDZallU7x8T8n1PrKM8vY1rzfmushao6CXn2vTAi9MP7ogTW13Xa3dbwkwJfu48J6T-nuv33I4Dzb5DDvBePuQ4R7PxABSx9V8n53gw9eftv0gQDhfNAp9d4h3vl+v336n3apXifNel8X-QZgsHx-UCn8L+fmfz-yE4M3-fj-LxUhGHEfB7WsE-HfZfJ-cSAxBRUAuuO-avQA6ApHJxFHeAn2RfVlbvaxVA+JL2BAh6JnAwUPIXADdnJgLnHnPnAXKIGrPIEXHgMXBESXALGXOXBXJXFXNXDXLXWAE3PXA3I3E3SoM3AsS3Nda3W3e3R3Z3V3d3aAT3K3XoCPBiVOYbAPC9IPZQubBQwJOQGCaFQCVQqPGPaQQw2JEFAwWYdQYgsIWuGIAwtASw8gjnFCVAbnXnfnQXegxg5giXaAKXdgyYTg5XVXdXTXbXXXfXYoYQkoUQsAc3CQ2bG3VbB3ImOQt3CmJQyQlQ6QsfDQybVlP5SgOpPIAAK0oGUS8zMNAHgBeTMlj2c16Fmz0GRAACFDRF0V0YsQMNBnMRB4BzBzAQRhihcABVCgznDw6g7wug-rBg0XWCcXKowItg2XEIxXMIngyI-g6IoQleEQsQi3RPbndUXSCAMYmrfFDHSQLiNwC49UHAdUfFBQ9Ip3F3LIiIWXK4hYyozAAAfg1Ci0QAAF44gUAl9ZDPiFDIY7CPR9h0BhjXDKCZivDaDw8-DliWC1jpcNj5ctjuCIi+CBCYjDdDj4jjj8UESkTzA5AcAxA-kuAq1PtbjjAkACBHizjUBXiKZ3jMiFDZdnM8gkSgTItXBwTU5miRQKA2jKBOi8Jl1t0TUETBjhjRjzAJipj3DPCaCfCFisScAVjWC8SODCTwjeCojywyS4jTdEjxDTjnjUALjfjWT4A7iOSuSnT8Vuj+TPjuifjNT6D-jEAxSQTJSOBITiiMj-SqAV1SUtD+jEShjzAUTpjdS5jMSlijScSgj8TQiiTLS9jrSDjjdKT7STjmiUz6TGTU8WSbj3T2SHjHSXjfToTXcAyESRShiwyJS1A31XBGVisBsQB2yvi1tRyYyOy4yOpKAwBIIYJl4z4+kQB9l9kApuVqBIRwIxBogwA-AORuQsB9z7ihBgMwIvlEySiAVylIzICsBIROh5QAMq1v1+z0UzIwBYlo8VzV1DQsAyU6IhASc1QNRIZ5kxBTjY9IAuAcBMBH0mBlQ5zvyxJG4YBBAjxjyvNGjpBZs+s3zvw-BnlkBXlksI0ZAcJcwOAAB3EgXTEAKwt1HzfqEAawV8gwVgBWGCuCtwKlJgCC+iYqKlBPEwD5NCuAJATCyASQTbPCmgAij7QPGQLpHyJSxgFS6pcZAINShfTLeCBSusacAiAyzLMiEy+sRsE8ZSjLNcS8GIbMaywy-cdcGIZsRyzLFyzAKy9Smy6cTyxAJ8O8Di3S+sQKl8N8CDdy+sYi0ilLcy6cRzZzKlVzMi7qKK6cBLKlYreK-cbLXLfLQrbK4Kyi4gFi2inTDgRijgHzN1Ni-lAwdosfbi+CvigwJyvwSGSAdCySjcLCmS3HCgfC4KgqLQHSjS0yMaypMZVZIonKt0NIOag8JMFcny9qhsEcLMRasy4a3y-cSyxa-yhy1ajyuyzANy462y5aryg606gKm8IK9K-cMK38SKi66cF6gCICeq6yqiWpcinyqiNrNpBSwqISTTFax7QSVAIGnKEGqGmlHa5ZVrbidrXiaypG25GVdG6aiZE5eFbGnyLSyZLqTZcKFwOGygE5M5SAJIRamKggIqx6g8omJKq6xARmt6-cTKpLOKnatavKjiPLaAArJUDmyGEUBADcKrKG16yGRrESFrGGjrYqiCEgMqqihiui6q+VOq9PJqj0HihCtq-cjw+iOZHoTqqACSlAXq6SnCsgQa+Sna7UE4RMgG0at2yGJGyapGomyal2jofS524EDofyhSgOsYDamYcOkOyOs4JsGO44H4KO7yyGCO5kKG6EWEeEdSJELdYOpOs0dKJLMkCkfO6y9O6rEu4wQ81lHyyuoUfzQLAu3EDOygWUALBUJUOutO2Otui0A0I9FunUc0bzL9Ha36kbAFCe1iFG4Gme4uzGiGka4upWtG924uhGgm6pNehSjG8Gp1be0yImvG2CPenGtZEm2CLZcmheqm85WmnaiWw0GIaW4u2Wkq9WiqzW4gWNEAGq7ldikAAZfW2ClqtGlnQkcUcSjC227C2Sx29eyG7QT2lewkJew+jewkXeheoqaWI+uwDBttH6rQe+mmy5J+irFAIwKuj+1W3+mi5VSq1FJi3NQB761QVOZq3itG65RomBnqmIPq+2k9RB8+1S1Bj7dBg+4hnypGv6tKuR8GHBghggIhimshi5YQN8kqzVFGBPHnPQexWJUkUbNkYwEETlO3RTJgcKdAa5OIcq-DH+5YVh+DXWgwP8UBw21qlCKCGZARm2oRu2hB3rJ2khlBqbJRiRqJr2i+2anakiWCeCI6yGJJjCD0c6tJ-x-CKO1JiCHJnAbaiJhRimlRrBsG6DTB5B7Bue2G3BmgLe6J6pUpxG5Rup5W1R9Rtpwmma0+nAcRzSvpq+nAG+nulezRx+6y5+qWmhmWnR+hr6fRrzLHO9Z0CAagZUsFXxakSgcxmhqx2JW0bQ+x1wRxkgP+qw+i5i9hpgAAcXfJACjKYDHNhLBXojrgMELH2T5DUCAA',
    },
    {
      title: 'Navigate healthy human cells with the Common Coordinate Framework',
      body: 'Interact with the human body data with the Anatomical Structures, Cell Types and Biomarkers (ASCT+B) Tables and CCF Ontology. Also explore two user interfaces: the Registration User Interface (RUI) for tissue data registration and Exploration User Interface (EUI) for semantic and spatial data.',
      image: <CarouselImage {...getCDNCarouselImageSrcSet('ccf')} alt="CCF Portal" key="CCF Portal" />,
      buttonHref: 'https://hubmapconsortium.github.io/ccf/',
    },
    {
      title: 'Analyze single-cell RNA-seq experiments with Azimuth',
      body: 'Explore Azimuth, a web application that uses an annotated reference dataset to automate the processing, analysis and interpretation of new single-cell RNA-seq experiments.',
      image: <CarouselImage {...getCDNCarouselImageSrcSet('azimuth')} alt="Azimuth" key="Azimuth" />,
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
