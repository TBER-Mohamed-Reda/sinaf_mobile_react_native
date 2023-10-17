import { extendTheme } from "native-base";

export const BaseTheme = extendTheme({
  fontConfig: {
    Roboto: {
      300: {
        normal: "Roboto",
      }
    },
    
  },
  components: {
    Text: {
      defaultProps: {
        fontSize: "lg",
      },
      sizes: {
        xs: {
          fontSize: "xs",
        },
        sm: {
          fontSize: "sm",
        },
        md: {
          fontSize: "md",
        },
        lg: {
          fontSize: "lg",
        },
        xl: {
          fontSize: "xl",
        },
      },
    },
  },
  colors: {
    green: {
      50: '#f5fde0',
      100: '#e6f5b9',
      200: '#d7ee90',
      300: '#c6e764',
      400: '#b6e03a',
      500: '#81B069',
      600: '#7a9b18', //color logo norsys
      700: '#576f0f',
      800: '#334205',
      900: '#0f1700',
    },
    red: {
      50: '#ffe5e7',
      100: '#fbbabe',
      200: '#f28e93',
      300: '#ea616a',
      400: '#C73D51',
      500: '#ca1c26',
      600: '#9e141c',  //color logo norsys
      700: '#710c14',
      800: '#46050a',
      900: '#1e0000',
    },
    blue: {
      50: '#e9eeff',
      100: '#c6ccef',
      200: '#a2abde',
      300: '#7c89cf',
      400: '#4B6FB2',
      500: '#3e4ea7',
      600: '#303c83',  //color logo norsys
      700: '#212b5e',
      800: '#121a3b',
      900: '#05091a',
    },
    grey: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
    primary: '#2185d0',
    secondary: '#a7acb1',
    success: '#199954',
    info: '#6edff6',
    warning: '#FFC107',
    danger: '#DC3645',
    light: '#f8f9fa',
    dark: '#dee2e6',
    link: '#6ea8fe',
    border: '#495057',
  },
  fonts: {
    heading: "Roboto",
    body: "Roboto",
    mono: "Roboto",
  },
  Pressable: {
    cursor: "pointer",
  },

  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "light",
  },
});
