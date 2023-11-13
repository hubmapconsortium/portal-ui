import React, { useState } from 'react';

import CarouselImage from 'js/components/home/CarouselImage';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import ImageCarousel from '../ImageCarousel';
import ImageCarouselControlButtons from '../ImageCarouselControlButtons';
import ImageCarouselCallToAction from '../ImageCarouselCallToAction';
import { Flex, CallToActionWrapper } from './style';

const slides = [
  {
    title: 'Discover the publications reporting the breakthroughs of  mapping the human body with HuBMAP data',
    body: (
      <>
        Explore publications authored by scientists in the consortium involving HuBMAP data. Additional publications
        will be coming in the future as the consortium continue to create mappings of the human body. View the{' '}
        <OutboundIconLink href="https://www.nature.com/collections/aihihijabe/the-hubmap-website">
          2023 Nature collection
        </OutboundIconLink>{' '}
        reporting for these publications.
      </>
    ),
    image: <CarouselImage imageKey="publication" alt="HuBMAP Publications" key="Publications" />,
    buttonHref: '/publications',
  },
  {
    title: 'Explore spatial single-cell data with Vitessce visualizations',
    body: 'View multi-modal single-cell resolution measurements with reusable interactive components such as a scatterplot, spatial+imaging plot, genome browser tracks, statistical plots, and controller components.',
    image: <CarouselImage imageKey="vitessce-2" alt="Vitessce" key="Vitessce" />,
    buttonHref:
      '/browse/dataset/69d9c52bc9edb625b496cecb623ec081#vitessce_conf_length=5937&vitessce_conf_version=0.0.1&vitessce_conf=N4Igxg9hBOAmCWA7AhgF3hRBlADssApiAFyixrIDOBqJoAgiSIwL4A0IBAtgEYGwJEAcwAqATxxFSzJqgC0WAHIBREOxAQelcZLozi4AgBsjajgDMCaAK7QCOqQyZCCiIuss27ANWRHr9hKO+pwAHjh2lJQYiGacvPyCQgBaUFx6jMQATABsAHRZAJw5WQAMABwAzADsACyFdaWF6tx8AkhCAEoQqGgxGSSlLQntwiLI0C6oABoDxHKVeU0AjA2V9YWbW+UArARy1cNtSeOTNACac3I7eTm1teW1NRtbm-uHHK2JHadTyXNDT4jJIAeS0WBoAAUIEYxEJMJRvPBojwjMFMuY-NQjt9hGDKBDUAAZZB8IyI5HwVHokiY8kEHGjIT4wkkslYeAALxpxGWtUZoK0nWQCGslDmywFHXxwtFlAAshBYDyQMhrKgIHEvkz8SC8GB4KgxBKpXitHr8IaxIrlXNVerNepKHh0H5UhB0tJMnJanlNllljtSllqqVKoUdk8djsnS74H5ur10JgAbG+n5fjRZl6SLVquVlnlKqUdgWsjtKuVipKOM700ZM6hLjniA9S3knoU+dUA7l7jHa3GMxM-nNENYTGnXUZE31MNmnMRx5PB-XZ8nEM3F8ujFP4zOenPEP8Wzu9wnDxuQdAeIbU6vp9fb6h6KFkWOJ7uH-vX8iAGLwKE-BzHS2IcAAFlYqBcMgODulwC76ICICQWgMFwWkW5IeoqHQbBjaIZkyG4ehjZYUR6iaJQAFGKgBDQB+K4aFoAAS8BCOBRjseBtCnp+lHgjQEJomAG5zAA2uJIAAMLGEYAAEADScjylYiCUPJ4moEoygAPr0CYul-lBtgEJQAC6IAcMsIDmWwUmySYSkqWpGlaTp+mGcZXhmZZHBZLZ9kyXJzmqcg6madpKieUYRkmZEfkgJUtnmQJBI0GxHFcRxvHbvxHBUYS0kwjAEmgC64EkA5IXKWFEXudFBmxd5qCmRZgXgCVDHEOJOTlGwyyrANoapWw5VoJVPXBU5tWuZFHlNXFPntdZHWQEYpU9X1A1DcsI3sONqCTdVM0ueFblRXpi0tW1iUBXZnUbd14nLJUORsGUtQfZWo2Hcd00KbN53zY1Xnxb5VlJWtXVVdte2lANFa-SAFVVQDoVzeJdVyE1CjWDwnQEEIMQWfJyjhJE0Qpg962bb1-WDYUw2lMjqNTY5gNnfV2O41g+OE8TCLmWTFNmVTsSrTTMNbQzu37WNKMTWjHMY8DWNqTjJh4wTRMk8L5MRGL-T+dDT1Va972fd95Ss0r7M1Vzbk81rfM64L6n66LUTG1DUtmzLzOI5UttHcrDt1U7ame4b3vUxwtPPXDcsswdiuh-bp0R5pdXR5TPs2X7dNJ0z8Mh-9KtA9zUcizH4uQ-d8fSy9b0faUX1ZD9qdsydnNZ+r4W50bKYcMlheJwzoZB2XYeZ5jWDgbB+zeAQokwO1Y+w7LJfy39M+93PC+SHIy+r9AK0gAXjf+-TO3bynCvd+jldufPi-HyvGpn3dpt0xbrft53B+dse6q3qq-I+J9P7n1HlfIuE8EaBmDl3YBT9HaaREAQUIrU7CWQ3gHRmzNp4Z33mrDBWDTKJUvo9OBt9CHIPTiA5+6DDxGEHrHWIeCb4ENLvQ8u4dMYiBYWwuuktYHj1oTwoBDDUF90Eb0VhNc87DxAA3ahz0-5Ww7jbXhe9QFuTkX4YRPsYFqM3oHRBRDGFoPEsVAAbhMeMiBCBGLjqY-BydLEyMxnYhx4VnGKKHhLC+P9xHcJ3mnPhs81Y+OgI4-xBslFBNUQnc2LdNGAN3sQvRmkYlxIIC4oJJiUn4MnhYlgo0QCeGwQQGidFup5SYlU0ymVOLcVyvoM8FhwbCQ-v0FsDkAAiZRbIeHBr4fwBBipPXQnaHARgqAwTiE0nwfgAhTJgOhYUwgeTiQRqUAo5YKlUXWdAZQTilQdDtC4NwPTRL9HPEYAAkjBFwJIxD0TKiAI0ugDDQCoHUyGSBlShEGBwWxlJqQkFQNAAIYiZlLk-AVfUVoSDLA4LAD0yAkAOCYPKJAAB6eUyAQUcGhedPAdhECoBOSQHcHBKXKlicIG0UhmDtHQLYogHAxQEEqLAWkWICDxwXogNw5IqqgGoCJMS0hOSgq+fKsAJAyjqGKeJcsOwPrRi1TsB64KURoihTCoVIBKBcUZVVdYmrQzLG0QrKVvSUyyvlbxBG4ASA5FVU3BGGq2AszBRCw1xBoWwtNeaj5PVXpZHKNUNgORoyVF1anB1dynWgDlcQN1rr44kAHG49V2qfXRj1YGqQIaTVmvgBayNVQ2DVEKLUe+krjCOtiM6zNpLFXKs9WIqqeydUloNWW41tZw3qLzIjcoORUrI2+ay58MFKAAGtAWIGBaigNQ6jWhoTvCulGhkVGg3SADFMFsVBFxQSolJKvl-PUhS1w1LvV+r9Q9Bl9EOgsqYPQdl8BOWQx5XygV9JhXhTFeKHqzbpV9NAEqjtCr4MZuQmq-tGrB1UiDaBCtY6qpZCyANJ45QKjIxTTK2Dx7s0gCQ166+RbNX+pAPqjDw7Q2VurS9Uosa+Q1ByNO5NLbU1tvI9kTtiHBg0bpr6uj6HIXECw6OqtEaXq5AI+GPDJGBNkfdcQSoom3XUd7T1X1UmZOYcFQp9je1VN1EKDO8pDyIRCC4I+o8byI0NK-KaocRhoRIGJMgd59SOn5S8-WRQBBuI8BgOBKAsA3NBcyJ01Uv7MB+BZDQCDHn1BcBhCvCcBAWnZR4oxXc6hyC9GoKgCD4lQDmHgGiartX6uBB+aqUV5XkByEICYSgeROQTAYkijcmXKn4CgWjKi+KK7WMujFJa1Tz6Tem33Z2RhtYCz1gE9hkMlv8LVjnLbIjmKUCm3tsBh8l4fzXolXbUT6pkOqTdrQp27v6KEYdn2t2SH1VyX4-JH3XHoRwB0Eb8gdJ6AQFwarCCHpLoIMaAwVEuD4qq24NQ6hQgI+O8jzHcQUDOaYN18V3LoCmAMDxVAOBKDEHxfiqglXevgXxuhSA6kYDoGsFwPIMAhD4pyIUWAhQwA7CyDwMAhR+A8BKDsHg9QciEDAFLjuK8KjLDp+1igch+vQGgPiuwQhSilGWLpTBEQ5BgY631gbZgmtohxQYC3muidyAZ1bnXO2cDDYlSAIQ0AIDWBwIoZABODDLcxrN664Nz6VaDyH47L3vsXQWmDZallU6+-94H4PrKw-7Y1rzfmushYA6CTH7PTAvvZP7ogTWa3XYbeLwkwJNufd+4D7HnPZ3I4DxL5DMvcfK9MOrwUlvGf2-l9D13zS4DLun2jzQDvFfnu5-O2-SB13R9t6z3Hlf+jMGPb7wvif8fd-oP3xQzfmfF+T9e8w+RI-axH4H8vqf4kDEKKb9t9PW-r9eOiRAexWJP7B-U1J-VlQfaxX7Jxf7T-OucpDgfHVlZ3BnADUnJgCnKnGnOnKIDLPIJnHgFnBEdneATnbnSYPnAXIXEXMXCXWAJXGXOXBXJXSoFXAsdXNdTXbXXXfXQ3Y3U3aAc3DXXoN3BiVOOrO3C9B3IQzrfgwJOQGCaFQCEQj3L3aQBQ2JEFAwWYdQRApgWQ9heQtADQ1AsnFCVASnanWnenXA-AwgtnaADnLnHnCgwXYXUXcXSXaXWXYoJgkoFgsAVXdgjrLXAbPXImXgk3CmQQjg4QrglvcQlrVlP5SgOpPIAAK0oGUQgE9xJj0HgBeTMm92c16A6zyMoAACFDRF0V05NzMNBnMRB4BzBzAQRmiGcABVNA8ncwzAqwnAqrPA5nWCVnTIhwkgpw8g-nVw6gjwugrwxgleZg1gtXf3SndUXSCANojLfFYHSQLiNwDY9UHAdUfFfgsIg3I3SIiIbnLYgYjIzAAAfg1Dh0QAAF48dj8eDLj+DIY50K9nM5B0BmiTD0CejLDsDXdbDhiiCxjSDnCpiqD3DaD6DvD5dFi-Dlj8UPQaAmjzA5AcAxA-kuAq0TtdjjAkACBDi1jUBTiKZziIj+DudnM8ggSniIAXj3jU5iiRQKAyjKi8Jl1t0TVsTGjmjWjzAOiuizCLCsDrCBioScARjiC4TJjKC3CaDPDyxUTfDlcAi2DVjjjUANjbjST4A9iKSqTDT8Vqj6TLjqibiJTcD7jEA2SOSPi48vjjdqjfjJD6j9ggTzAQTuiZS+jIShjFSYTHCyDecET1TZiUSFjFcMS9SVjijcT8TCTg8SSdizTySDiDSTibTPTdJ7TsSWSmjXTXBOS31XBGV4tqsQBiyfj6Vwi7SqAV0HpKAwBIIYJl4z4+kQB9l9kApuVqBIRwIxBogwA-AORuQsBpz9ihBgMwIQBdDfl-kPl4DVzj8sBIROh5QAMq1v01AHplQuzYkcinUQBV1DQsAyU6IhAsc1QNRIZ5kxBVjvdIAuAcBMBH0mAzywALyxJG4YBBAjx5zsjCjpAOtKtjzvw-BnlkBXkAsI0ZAcJcwOAAB3EgXTEATQt1BHfqEAawI8gwVgBWL8n8twKlJgN8+iYqKlP3EwD5ECuAJAcCyASQEbGCmgOC47e3GQLpHyASxgIS6pcZAIESvvbzeCPiusacAiOS7zMiJS+sRsE8QS0LacdcGIbMTS+S-cHSzAZsfS7zIy48VS7Sy8GIJ8O8Mi6S+sWyl8N8CDUy+sRC5CwLSy-cRzZzKlVzFC7qNy6cXzKleLbyvwcLSLaLWLcK+y9C4gIi7CnTDgfCjgBHN1Ei-lAwcolvSi38migwAyvwSGSAUC9ijcCCriiHCgWC+ygqLQKSsS0yJqypMZVZRIiKowWS+qrSwy6yq80Svq4cM4GYLqlS3q4qhsEcGgDSoaqa8yvS+asygazcLq8yuahyqypMGym8Oy4K-cJy38Vy5a+sY6gCICbKzSqiWpVCoaqiQrNpPiwqISTTAc+6wSVAR6nKZ6z6mlXq5ZArbiIrXiTSwG25GVMG9qiZE5eFKGnyCSyZLqTZcKFwX6ygE5M5SAJILqjyggOKg6mcomPynazAAm06kKiAPzcmra-cKKjiKLaAGLJUGmjgEUBADcNLT6k6yGHLESfLb64reKiCEgJKjCvCnC9K+VLKpgaSPKj0Kiv8oq6c8w+iOZHoUqqANilASqziqCsgWq3i3q7UE4X0j67QM2yGQG1qwGxG1qk2joHqzSh24Qcyvil20QGasa424EH4L2kyoaj29S9232s0dKVAaEWEeEdSJELdH244aUT6tkYwCkOO520O5kJO0kYwWc1lQOjOmUEUEgnmoEBOsO2UYur9eO3ETOygC0A0I9aunUc0Q9a0JUPOnbLQW6oK82wW0G82wkCG96zu8Ovu9GoqaWeG6pMegG7pN6waq26GtZZG2CPi22jq2G2CLZNG3q45LqLGi5YQPi9mw0GILm8OnmhKsWlKiW4gWNEADK7lUikAAZeW78gq0GonQkcUVisC3WyC7iw2-uke1ql67Seetta6z6meqB8O-6qe0yIehehqjG-e85HG3qk+zmowdLKrY8hK++5K-DW+5YAi3NJ+q61QVOfK6i0G65Qo3+iqmIKq-Wk9IBte8GUBz6pByBoawG7ujhnyGBvhue6DZB47TG9By5YWlCchlGP3KnPQQA+MakSgZOnBzlHXRTJgcKdAa5OIIh1K1FMh+DGWgwP8N+xWwqlCKCGZRhnW5hvWwBirI22Bm2zhy25qlZCZVqkiWCeCJayGPxjCD0AOoJ2x-CL2wJiCCJnACa2BgR3e1iYGp6pJ8Onh8ejKFJn6tJie-2BBuwRJgpoGrKVJ4pjJ2ehGjelenAQR8S6p6ZLe1GjulByR7G6RzSrBs+nB7m-BkW1sDgCIbI0HO9Z0CAagIUsFXxVR9RkETR2JW0KQvR1wAxkge+zQ3CwiihpgAAcRPIQM+NbL4Ipkhk0brgMELH2T5DUCAA',
  },
  {
    title: 'Navigate anatomical structures across scales with the Human Reference Atlas',
    body: 'Explore the healthy human body via the Anatomical Structures, Cell Types and Biomarkers (ASCT+B) Tables linked to existing ontologies using the Registration User Interface (RUI) for tissue data registration and Exploration User Interface (EUI) for exploring experimental data semantically and spatially.',
    image: <CarouselImage imageKey="ccf" alt="CCF Portal" key="CCF Portal" />,
    buttonHref: 'https://hubmapconsortium.github.io/ccf/',
  },
  {
    title: 'Analyze single-cell RNA-seq experiments with Azimuth',
    body: 'Explore Azimuth, a web application that uses an annotated reference dataset to automate the processing, analysis and interpretation of new single-cell RNA-seq experiments.',
    image: <CarouselImage imageKey="azimuth" alt="Azimuth" key="Azimuth" />,
    buttonHref: 'https://azimuth.hubmapconsortium.org/',
  },
];

const disableRandomImage = true;

function ImageCarouselContainer() {
  // In order to keep highlighting publications, the shuffle functionality is currently disabled.
  const [selectedImageIndex, setSelectedImageIndex] = useState(
    disableRandomImage ? 0 : Math.floor(Math.random() * slides.length),
  );

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
