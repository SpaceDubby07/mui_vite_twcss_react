import { createTheme } from '@mui/material';

export const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export const responsiveDesign = {
  '& .MuiFormControl-root': {
    width: '100%',
    '@media (min-width: 600px)': {
      width: '300px',
    },
  },
  '& .MuiTextField-root': {
    width: '100%',
    '@media (min-width: 600px)': {
      width: '300px',
    },
  },
  '& .MuiButton-root': {
    width: '100%',
    '@media (min-width: 600px)': {
      width: '150px',
    },
  },
};
