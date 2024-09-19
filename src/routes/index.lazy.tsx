import {
  ThemeProvider,
  createTheme,
  useColorScheme,
} from '@mui/material/styles';
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  styled,
} from '@mui/material';
import { createLazyFileRoute } from '@tanstack/react-router';
import Nav from '../components/landing/Nav';
import Header from '../components/landing/Header';
import Featured from '../components/landing/Featured';
import Pricing from '../components/landing/Pricing';
import { useEffect, useState } from 'react';
import ScrollToTop from '../components/landing/ToTop';
import Footer from '../components/landing/Footer';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  // Determine if the current mode is dark (for toggling purposes)
  const isDarkMode = mode === 'dark';

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <MaterialUISwitch
            checked={isDarkMode}
            onChange={() => setMode(isDarkMode ? 'light' : 'dark')}
          />
        }
        label={''} // Shows the label accordingly
      />
    </FormGroup>
  );
}

function MyApp() {
  const [sticky, setSticky] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Our Layout
  return (
    <Container
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 2,
      }}
      maxWidth="xl"
    >
      <section
        className={`sticky top-5 left-0 right-0 z-50 transition-all duration-300 ${
          sticky
            ? 'bg-opacity-70 backdrop-blur-md backdrop-saturate-150'
            : 'bg-opacity-50 backdrop-blur-md'
        }`}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginX: 'auto',
            border: 1,
            borderRadius: 2,
            p: 1,
          }}
          maxWidth="md"
        >
          <Typography variant="h6" component="h4">
            PalLine
          </Typography>
          <div className="flex items-center">
            <ThemeToggle />
            <Nav />
          </div>
        </Box>
      </section>
      <section id="header">
        <Header />
      </section>
      <section id="featured">
        <Featured />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="footer">
        <Divider sx={{ width: '100%', my: 2 }} />
        <Footer />
      </section>
      <ScrollToTop />
    </Container>
  );
}

export const Route = createLazyFileRoute('/')({
  component: () => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MyApp />
    </ThemeProvider>
  ),
});
