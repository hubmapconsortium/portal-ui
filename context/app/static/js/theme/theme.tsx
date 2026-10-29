import { grey } from '@mui/material/colors';
import { createTheme, type ThemeOptions } from '@mui/material/styles';

const purple = '#444A65';
const purpleDarkMode = '#BFC2D4'; // same hue as purple, but with AAA-compliant contrast ratio on #333 background
const blue = '#2A6FB8';
const blueDark = '#265a92';
const blueDarkMode = '#A3C5EB'; // same hue as blue, but with AAA-compliant contrast ratio on #333 background

interface ProvenanceColors {
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

interface ContainerColors {
  main: string;
  contrastText: string;
  secondaryContrastText?: string; // used for unselected Tab in Tabs
}

interface AccentColors {
  success90: string;
  primary90: string;
  info90: string;
  warning90: string;
}

declare module '@mui/material/styles' {
  export interface ZIndex {
    tutorial: number;
    dropdownOffset: number;
    header: number;
    dropdown: number;
    visualization: number;
    fileBrowserHeader: number;
  }
  export type ZIndexOptions = Partial<ZIndex>;

  export interface CommonColors {
    link: string;
    halfShadow: string;
    hoverShadow: string;
    brand: string;
    banner: string;
  }

  export interface TypeAction {
    activeTab: string;
  }
  export interface Palette {
    black: BlackVariants;
    white: WhiteVariants;
    provenance: ProvenanceColors;
    caption: CaptionColors;
    secondaryContainer: ContainerColors;
    primaryContainer: ContainerColors;
    action: TypeAction;
    graphs: {
      matched: string;
      unmatched: string;
    };
    accent: AccentColors;
    retracted: PaletteColor;
    retractedBackground: PaletteColor;
  }
  export interface PaletteOptions {
    black?: BlackVariants;
    white?: WhiteVariants;
    provenance?: ProvenanceColors;
    caption?: CaptionColors;
    secondaryContainer?: ContainerColors;
    primaryContainer?: ContainerColors;
    graphs?: {
      matched: string;
      unmatched: string;
    };
    accent?: AccentColors;
    retracted?: SimplePaletteColorOptions;
    retractedBackground?: SimplePaletteColorOptions;
  }

  export interface PaletteColor {
    lowEmphasis?: string;
    hover?: string; // Note that this is a `filter` value, not a color
  }
  export interface SimplePaletteColorOptions {
    lowEmphasis?: string;
    hover?: string; // Note that this is a `filter` value, not a color
  }

  export interface Theme {
    palette: Palette;
    zIndex: ZIndex;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- this is necessary to extend the module
  export interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    parameters: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    parameters?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    parameters: true;
  }
}

declare module '@mui/material/SvgIcon' {
  export interface SvgIconPropsSizeOverrides {
    [key: `${number}rem`]: true;
  }

  export interface SvgIconPropsColorOverrides {
    white: true;
    retracted: true;
    retractedBackground: true;
  }
}

declare module '@mui/material' {
  export interface PaperPropsVariantOverrides {
    unstyled: true;
  }

  export interface ButtonPropsVariantOverrides {
    elevated: true;
  }

  export interface ChipPropsVariantOverrides {
    elevated: true;
  }
}

// default HuBMAP color and font theme
const themeOptions = {
  palette: {
    mode: 'light',
    common: {
      link: blue,
      halfShadow: 'rgb(0, 0, 0, 0.54)',
      hoverShadow: 'rgb(0, 0, 0, 0.08)',
      // The header bar and the notice banner above it keep these colors in both modes.
      brand: purple,
      banner: blueDark,
    },
    primaryContainer: {
      main: '#C5C7CF',
      contrastText: '#252938',
      secondaryContrastText: 'rgb(37, 41, 56, 0.6)',
    },
    secondaryContainer: {
      main: '#EFEFEF',
      contrastText: '#363636',
      secondaryContrastText: 'rgb(37, 41, 56, 0.6)',
    },
    primary: {
      main: purple,
      hover: 'brightness(108%)',
      light: '#696e83',
      dark: '#2f3346',
      lowEmphasis: `${purple}61`, // 38% opacity
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
      dark: blueDark,
    },
    success: {
      main: '#6C8938',
      light: '#89a05f',
      dark: '#4b5f27',
    },
    black: {
      hover: 'brightness(96%)',
      focus: 'rgba(0,0,0, 0.12)',
      dragged: 'rgba(0,0,0, 0.16)',
    },
    white: {
      main: '#fff',
      hover: 'brightness(96%)',
      focus: '#FFFFFF1F', // 12% opacity
    },
    provenance: {
      step: '#B0C4DA',
      default: '#E0E0E0',
      input: '#CDC5F3',
      output: '#D5EAC3',
      group: '#B0DA8B',
      parameter: '#CFDFF1',
      inputFile: '#E7E3F9',
      global: '#FFB3B3',
    },
    action: {
      activeTab: '#9CB965',
      disabled: 'rgba(0,0,0, 0.38)',
    },
    background: {
      default: '#fafafa',
    },
    caption: {
      background: '#EEEEFF',
      link: '#3781D1',
    },
    graphs: {
      matched: '#4B5F27',
      unmatched: '#D1DAC1',
    },
    accent: {
      success90: '#F0F3EB', // success-90 in figma
      primary90: '#FBEBF3', // primary-90 in figma
      info90: '#EAF0F8', // info-90 in figma
      warning90: '#FBEEEB', // warning-90 in figma
    },
    retracted: {
      main: '#C72C2C',
      contrastText: '#fff',
    },
    retractedBackground: {
      main: '#E05C5C',
      contrastText: '#fff',
    },
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
    parameters: {
      fontFamily: 'JetBrains Mono Variable, monospace',
      fontSize: '0.825rem',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.026px',
    },
  },
  shape: {
    borderRadius: 2,
  },
  zIndex: {
    tutorial: 1101, // one higher than AppBar zIndex provided by MUI
    dropdownOffset: 1001,
    header: 1000,
    dropdown: 50,
    visualization: 11, // above sticky table HeaderCell (zIndex 10) so fullscreen viz covers metadata tables
    fileBrowserHeader: 1,
  },
  breakpoints: {
    values: {
      // keeping defaults from v4
      xs: 0,
      sm: 600,
      md: 960, // v5 default = 900
      lg: 1440, // v5 default = 1200
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
      variants: [
        {
          props: { variant: 'elevated' },
          style: ({ theme }) => ({
            boxShadow:
              '0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.14)',
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 100],
            },
            borderRadius: 4,
            fontWeight: 300,
          }),
        },
      ],
    },
    MuiTableCell: {
      styleOverrides: {
        // Sticky header cells are opaque, which hides the elevation overlay of the Paper they sit in.
        // Paint that overlay on them too; Paper only sets the variable in dark mode.
        stickyHeader: {
          backgroundImage: 'var(--Paper-overlay)',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        // MUI colors the sorted column's label text.primary. Inherit instead, so it matches the other headers in
        // panel lists, whose headers are subtitle2. Table header cells are text.primary already.
        root: {
          '&.Mui-active': {
            color: 'inherit',
          },
        },
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'elevated' },
          style: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 100],
            },
            boxShadow:
              '0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.14)',
          }),
        },
      ],
    },
    MuiAccordion: {
      variants: [
        {
          props: { variant: 'unstyled' },
          style: {
            margin: 0,
            border: 'none',
            boxShadow: 'none',
            '& .MuiAccordionSummary-root': {
              minHeight: 0,
              margin: 0,
              border: 'none',
              boxShadow: 'none',
              '&.Mui-expanded': {
                minHeight: 0,
                margin: 0,
              },
              '&:before': {
                // remove default pseudoelement border
                display: 'none',
              },
            },
            '&.Mui-expanded': {
              minHeight: 0,
              margin: 0,
            },
            '&:before': {
              // remove default pseudoelement border
              display: 'none',
            },
          },
        },
      ],
    },
  },
} satisfies ThemeOptions;

const theme = createTheme(themeOptions);

// The palette must be in the options, not merged onto the finished light theme, so that MUI derives
// the action, divider and text tokens and the light/dark color variants for dark mode.
// Keys that depend on the mode are replaced rather than merged so their variants are recomputed.
export const darkTheme = createTheme(
  {
    ...themeOptions,
    palette: {
      ...themeOptions.palette,
      mode: 'dark',
      common: {
        ...themeOptions.palette.common,
        link: blueDarkMode,
        halfShadow: 'rgba(255, 255, 255, 0.54)',
        hoverShadow: 'rgba(255, 255, 255, 0.08)',
      },
      background: {
        default: '#333333',
        paper: '#333333',
      },
      // In dark mode `white` is the surface that pairs with `primary`, e.g. in inverted tiles.
      // Text that must stay white, such as on the brand-colored header, uses `common.white`.
      white: {
        main: '#333333',
        hover: 'brightness(115%)',
        focus: '#FFFFFF1F', // 12% opacity
      },
      // The colors below keep the hue of their light-mode values.
      // Text and marks have AAA contrast on #333, like purpleDarkMode and blueDarkMode.
      // Tints have the same contrast against #333 as the light tints have against white.
      info: { main: '#93C5FF' },
      success: { main: '#ACCC79' },
      warning: { main: '#FFAC97' },
      error: { main: '#FEA8CA' },
      retracted: { main: '#FEACA3', contrastText: '#000000' },
      primaryContainer: {
        main: '#53555B',
        contrastText: '#F6F8FF',
        secondaryContrastText: 'rgba(246, 248, 255, 0.6)',
      },
      secondaryContainer: {
        main: '#3C3C3C',
        contrastText: '#CECECE',
        secondaryContrastText: 'rgba(246, 248, 255, 0.6)',
      },
      caption: {
        ...themeOptions.palette.caption,
        background: '#3B3B48',
      },
      accent: {
        success90: '#393C35',
        primary90: '#45393F',
        info90: '#383C43',
        warning90: '#433937',
      },
      provenance: {
        step: '#495A6E',
        default: '#454545',
        input: '#554D75',
        output: '#384828',
        group: '#375A05',
        parameter: '#3B4857',
        inputFile: '#434051',
        global: '#834244',
      },
      graphs: {
        matched: '#B1C98E',
        unmatched: '#474E39',
      },
      primary: {
        main: purpleDarkMode,
        hover: 'brightness(108%)',
        contrastText: '#000000',
        lowEmphasis: `${purpleDarkMode}61`, // 38% opacity
      },
      secondary: {
        main: grey[400], // about the same contrast on #333 as the light secondary has on white
      },
      action: {
        ...themeOptions.palette.action,
        disabled: 'rgba(255, 255, 255, 0.38)',
      },
    },
  },
  {
    typography: {
      subtitle1: {
        color: purpleDarkMode,
      },
      subtitle2: {
        color: purpleDarkMode,
      },
      link: {
        color: blueDarkMode,
      },
    },
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            color: purpleDarkMode,
            '.MuiAccordionSummary-content': {
              color: `${purpleDarkMode} !important`,
            },
            '.MuiAccordionSummary-expandIconWrapper': {
              color: `${purpleDarkMode} !important`,
            },
          },
        },
      },
    },
  },
);

export default theme;
