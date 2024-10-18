import React , { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SeachBar';
import FlightList from './components/FlightList';
import Banner from './components/Banner';
import { Container, LinearProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({

  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  MuiGrid2: {
    defaultProps: {
      // all grids under this theme will apply
      // negative margin on the top and left sides.
      disableEqualOverflow: true,
    },
  },
});

const App = () => {

  const [loading, setLoading] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        {/* we show progressbar when searching flights */}
      {loading && <LinearProgress />}
        <Header />
        <Container>
          <Banner />
          <SearchBar setLoading={setLoading} />
          <FlightList />
        </Container>

      </ThemeProvider>
    </LocalizationProvider>

  );
};

export default App;