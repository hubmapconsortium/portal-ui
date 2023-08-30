import { createTheme } from '@mui/material/styles';

const purple = '#444A65';
const blue = '#2A6FB8';

interface ProvenanceColors {
  highEmphasis: string;
  step: string;
  default: string;
  input: string;
  output: string;
  group: string;
  parameter: string;
  inputFile: string;
  global: string;
}

interface BlackVariants {
  highEmphasis: string;
  mediumEmphasis: string;
  lowEmphasis: string;
  hover: string;
  focus: string;
  dragged: string;
}

interface WhiteVariants {
  main: string;
  hover: string;
  focus: string;
}

interface CaptionColors {
  background: string;
  link: string;
}

declare module '@mui/material/styles' {
  export interface ZIndex {
    tutorial: number;
    dropdownOffset: number;
    entityHeader: number;
    dropdown: number;
    visualization: number;
    fileBrowserHeader: number;
  }
  export type ZIndexOptions = Partial<ZIndex>;
  export interface CommonColors {
    link: string;
    halfShadow: string;
  }
  export interface Palette {
    black: BlackVariants;
    white: WhiteVariants;
    provenance: ProvenanceColors;
    caption: CaptionColors;
  }

  export interface PaletteOptions {
    black?: BlackVariants;
    white?: WhiteVariants;
    provenance?: ProvenanceColors;
    caption?: CaptionColors;
  }

  export interface PaletteColor {
    lowEmphasis?: string;
    hover?: string;
  }
  export interface SimplePaletteColorOptions {
    lowEmphasis?: string;
    hover?: string;
  }

  export interface Theme {
    palette: Palette;
    zIndex: ZIndex;
  }
  export type ThemeOptions = Partial<Theme>;
}

// default HuBMAP color and font theme
const theme = createTheme({
  palette: {
    common: {
      link: blue,
      halfShadow: 'rgb(0, 0, 0, 0.54)',
    },
    primary: {
      main: purple,
      hover: 'brightness(108%)',
      light: '#696e83',
      dark: '#2f3346',
      lowEmphasis: `${purple}26`, // 38% opacity
    },
    secondary: {
      main: '#636363',
      light: '#828282',
      dark: '#454545',
    },
    error: {
      main: '#DA348A',
      light: '#e15ca1',
      dark: '#982460',
    },
    warning: {
      main: '#D25435',
      light: '#db765d',
      dark: '#933a25',
    },
    info: {
      main: blue,
      light: '#5f9ada',
      dark: '#265a92',
    },
    success: {
      main: '#6C8938', // '#9BC551'
      light: '#89a05f',
      dark: '#4b5f27',
    },
    black: {
      highEmphasis: '#000',
      mediumEmphasis: 'rgba(0,0,0, 0.6)',
      lowEmphasis: 'rgba(0,0,0, 0.38)',
      hover: 'rgba(0,0,0, 0.04)',
      focus: 'rgba(0,0,0, 0.12)',
      dragged: 'rgba(0,0,0, 0.08)',
    },
    white: {
      main: '#fff',
      hover: 'brightness(96%)',
      focus: 'brightness(92%)',
    },
    action: {
      active: '#9CB965',
      disabled: 'rgba(0,0,0, 0.38)',
    },
    background: {
      default: '#fafafa',
    },
    mode: 'light',
  },
  typography: {
    fontFamily: 'Inter Variable, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 300,
      fontSize: '2.6rem',
    },
    h2: {
      fontWeight: 300,
      fontSize: '2.3rem',
    },
    h3: {
      fontWeight: 300,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 300,
      fontSize: '1.6rem',
    },
    h5: {
      fontWeight: 300,
      fontSize: '1.3rem',
    },
    h6: {
      fontWeight: 300,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1.1rem',
      color: purple,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: purple,
    },
    body1: {
      fontWeight: 300,
      fontSize: '0.95rem',
    },
    body2: {
      fontWeight: 300,
      fontSize: '0.8rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 300,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'capitalize',
    },
  },
  shape: {
    borderRadius: 2,
  },
  zIndex: {
    tutorial: 1101, // one higher than AppBar zIndex provided by MUI
    dropdownOffset: 1001,
    entityHeader: 1000,
    dropdown: 50,
    visualization: 3,
    fileBrowserHeader: 1,
  },
  breakpoints: {
    values: {
      // keeping defaults from v4
      xs: 0,
      sm: 600,
      md: 960, // v5 default = 900
      lg: 1280, // v5 default = 1200
      xl: 1920, // v5 default = 1536
    },
  },
  components: {
    MuiCssBaseline: {
      // use body2 style like v4 instead of body1
      styleOverrides: {
        body: {
          fontSize: '0.8rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
  },
});

export default theme;
