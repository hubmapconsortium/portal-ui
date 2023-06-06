import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    @supports (font-variation-settings: normal) {
        @font-face {
            font-family: 'Inter Variable';
            font-weight: 1 999;
            font-style: oblique 0deg 10deg;
            font-display: swap;
        }
}
`;
