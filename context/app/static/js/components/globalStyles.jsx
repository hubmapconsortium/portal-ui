import { createGlobalStyle } from 'styled-components';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const GlobalStyles = createGlobalStyle`
  :root {
    --header-height: 64px;
  }

  body {
    left: 20px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  li {
    list-style: none;
  }

  #react-content {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  a {
    text-decoration: none;
    background-color: transparent;
  }

  .lu-wrapper {
    // For LineUp:
    height: calc(100vh - ${headerHeight}px - 100px);
    // 100px for the page title.
  }
`;

export default GlobalStyles;
