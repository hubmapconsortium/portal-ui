import { createGlobalStyle } from 'styled-components';

import InterVariable from '@fontsource-variable/inter/files/inter-latin-standard-normal.woff2';

export default createGlobalStyle`
    @supports (font-variation-settings: normal) {
        @font-face {
            font-family: 'Inter Variable';
            src: url(${InterVariable}) format('woff2');
            font-weight: 1 999;
            font-style: oblique 0deg 10deg;
            font-display: swap;
        }
}
`;
