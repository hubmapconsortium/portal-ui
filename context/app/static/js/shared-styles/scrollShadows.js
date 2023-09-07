import { css } from 'styled-components';
import { isMobileSafari } from 'react-device-detect';

// See https://css-tricks.com/scroll-shadows-with-javascript/ for reference.
// The scroll shadows will not work on iOS Safari.
// See https://bugs.webkit.org/show_bug.cgi?id=181048

const sharedStyles = css`
  background-repeat: no-repeat;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;
`;

function buildScrollShadows() {
  if (isMobileSafari) {
    return '';
  }
  return css`
    background:
    /* Shadow Cover TOP */ linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top,
      /* Shadow Cover BOTTOM */ linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom,
      /* Shadow TOP */ radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top,
      /* Shadow BOTTOM */ radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center bottom;

    ${sharedStyles};
  `;
}

function buildStickyTableScrollShadows(tableHeadHeight) {
  const tableHeadHeightPx = `${tableHeadHeight}px`;

  if (isMobileSafari) {
    return '';
  }

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

export { buildScrollShadows, buildStickyTableScrollShadows };
