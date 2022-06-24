import { css } from 'styled-components';

// See https://css-tricks.com/scroll-shadows-with-javascript/ for reference.
// The scroll shadows will not work on iOS Safari.

const sharedStyles = css`
  background-repeat: no-repeat;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;
`;

const scrollShadows = css`
  background:
    /* Shadow Cover TOP */ linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top,
    /* Shadow Cover BOTTOM */ linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom,
    /* Shadow TOP */ radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top,
    /* Shadow BOTTOM */ radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center bottom;

  ${sharedStyles}
`;

function buildStickyTableScrollShadows(tableHeadHeight) {
  const tableHeadHeightPx = `${tableHeadHeight}px`;
  return css`
    background:
      /* Shadow Cover TOP */ linear-gradient(white 30%, rgba(255, 255, 255, 0)) center
        ${tableHeadHeightPx},
      /* Shadow Cover BOTTOM */ linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom,
      /* Shadow TOP */ radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top
        ${tableHeadHeightPx},
      /* Shadow BOTTOM */ radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center bottom;

    ${sharedStyles};
  `;
}

export { scrollShadows, buildStickyTableScrollShadows };
