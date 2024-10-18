import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, MenuItem, InputAdornment,
  Typography,
  FormControl,
  IconButton,
  Autocomplete
} from '@mui/material';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Grid from '@mui/material/Grid2';
import Select from '@mui/material/Select';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import FlightList from './FlightList';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TripOriginIcon from '@mui/icons-material/TripOrigin';


// Sky scrapper API Headers (api key and host)
const clientHeaders = {
  'x-rapidapi-key': process.env.REACT_APP_SKY_SCRAPPER_API_V1_FLIGHTS_PRIVATE_KEY,
  'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
}

// The flights search component
const SearchBar = ({ setLoading }) => {

  // State variables for managing user input and API responses
  const [flightType, setFlightType] = useState('round-trip'); // Type of flight (round trip or one-way)
  const [cabinClass, setCabinClass] = useState('economy'); // Class of travel
  const [startDate, setStartDate] = useState(null); // Start date for flights
  const [endDate, setEndDate] = useState(null); // Return date for flights
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor for passenger selection
  const openMenu = Boolean(anchorEl); // Boolean to check if menu is open
  const [startAirportDetails, setStartAirportDetails] = useState({}); // Starting airport details
  const [endAirportDetails, setEndAirportDetails] = useState({}); // Destination airport details
  const [inputValue, setInputValue] = useState(''); // Input value for airport search
  const [options, setOptions] = useState([]); // Options for autocomplete
  const [startAirportSearchResults, setStartAirportSearchResults] = useState([]); // Search results for starting airport
  const [endAirportSearchResults, setEndAirportSearchResults] = useState([]); // Search results for destination airport
  const [startAirportOptions, setStartAirportOptions] = useState([]); // Options for starting airport dropdown
  const [endAirportOptions, setEndAirportOptions] = useState([]); // Options for destination airport dropdown
  const [startLoading, setStartLoading] = useState(false); // Loading state for starting airport search
  const [endLoading, setEndLoading] = useState(false); // Loading state for destination airport search
  const [flights, setFlights] = useState([]); // State to hold fetched flight details
  const [ongoing, setOngoing] = useState(false); // Ongoing request state

  // Functions

  // Handles click on the passenger menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the passenger menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Resets passenger count to defaults
  const handleCancel = () => {
    setAnchorEl(null);
    passengers.adults = 1;
    passengers.children = 0;
    passengers.infants = 0;
  };

  // Updates input value for starting airport search
  const handleStartAirportSearchInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Updates input value for ending airport search
  const handleEndAirportSearchInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Initiates search for starting airport
  const handleSearchStart = () => {
    searchAirport(inputValue, "start");
  };

  // Initiates search for destination airport
  const handleSearchEnd = () => {
    searchAirport(inputValue, "end");
  };

  // Displays loading state for airport searches
  const displayLoading = (type, value) => {
    if (type === "start") {
      setStartLoading(value);
    } else if (type === "end") {
      setEndLoading(value);
    }
  };

  // Fetches airport data from SkyScraper API
  const searchAirport = (value, type) => {
    if (value.length > 2) { // Minimum 3 characters for search
      const options = {
        method: 'GET',
        url: `${process.env.REACT_APP_SKY_SCRAPPER_API_V1_FLIGHTS_BASE_URL}/searchAirport`,
        params: { query: value },
        headers: clientHeaders
      };

      displayLoading(type, true); // Show loading indicator

      // Make API request
      axios
        .request(options)
        .then((response) => {
          // Map response data to options for dropdown
          const airportOptions = response.data.data.map((airport) => ({
            label: airport.presentation.suggestionTitle, // Display name for dropdown
            value: airport.skyId, // Actual value to be used
          }));

          // Update state based on search type
          if (type === "start") {
            setStartAirportSearchResults(response.data.data);
            setStartAirportOptions(airportOptions);
          } else if (type === "end") {
            setEndAirportSearchResults(response.data.data);
            setEndAirportOptions(airportOptions);
          }

          displayLoading(type, false); // Hide loading indicator
        })
        .catch((error) => {
          console.error('Error fetching airport data:', error); // Log errors
          displayLoading(type, false); // Hide loading indicator
        });
    } else {
      setOptions([]); // Clear options if input is less than 3 characters
    }
  };

  // Sets selected starting airport details
  const getStartAirportOptions = (event, value) => {
    if (value && value.label) {
      const details = startAirportSearchResults.find(airport => airport.presentation.suggestionTitle === value.label);
      setStartAirportDetails(details);
    }
  };

  // Sets selected destination airport details
  const getEndAirportOptions = (event, value) => {
    if (value && value.label) {
      const details = endAirportSearchResults.find(airport => airport.presentation.suggestionTitle === value.label);
      setEndAirportDetails(details);
    }
  };

  // Formats date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Converts minutes to hours and minutes
  const convertMinutesToHoursMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60); // Calculate hours
    const remainingMinutes = minutes % 60;  // Remaining minutes
    return `${hours} h ${remainingMinutes} min`; // Return formatted string
  };

  // Formats date to "DD MMM"
  const formatDateToDayMonth = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`; // Return formatted date
  };

  // Builds parameters for flight search based on user input
  const buildSearchFlightsParams = () => {
    const params = {};
    if (startAirportDetails.skyId) params.originSkyId = startAirportDetails.skyId;
    if (startAirportDetails.entityId) params.originEntityId = startAirportDetails.entityId;
    if (endAirportDetails.skyId) params.destinationSkyId = endAirportDetails.skyId;
    if (endAirportDetails.entityId) params.destinationEntityId = endAirportDetails.entityId;
    if (startDate) params.date = startDate;
    if (endDate && flightType === 'go-return') params.returnDate = endDate;
    if (cabinClass) params.cabinClass = cabinClass;
    if (passengers.adults) params.adults = passengers.adults;
    if (passengers.children) params.children = passengers.children;
    if (passengers.infants) params.infants = passengers.infants;
    return params; // Return constructed parameters
  };

  // Searches for flights using constructed parameters
  const searchFlights = (event) => {
    setLoading(true); // Set loading state
    setOngoing(true); // Mark search as ongoing
    const requestParams = buildSearchFlightsParams(); // Build request parameters

    const options = {
      method: 'GET',
      url: `${process.env.REACT_APP_SKY_SCRAPPER_API_V1_FLIGHTS_BASE_URL}/searchFlights`,
      params: { ...requestParams, limit: 20 }, // Add limit to request
      headers: clientHeaders
    };

    // Make API request to fetch flights
    axios
      .request(options)
      .then((response) => {
        if (response.data.status === true) {
          if (response.data && response.data.data && response.data.data.context) {
            const itineraries = response.data.data.itineraries || [];
            // Format the flight data for display
            const formattedFlights = itineraries.map((itinerary, index) => ({
              id: index,
              destinationImageUrl: response.data.data.destinationImageUrl,
              from: itinerary.legs[0].origin.name,
              to: itinerary.legs[0].destination.name,
              duration: convertMinutesToHoursMinutes(itinerary.legs[0].durationInMinutes),
              price: itinerary.price.formatted,
              departureTime: formatDateToDayMonth(itinerary.legs[0].departure),
              arrivalTime: formatDateToDayMonth(itinerary.legs[0].arrival),
              carrier: {
                name: itinerary.legs[0].carriers.marketing[0].name,
                logo: itinerary.legs[0].carriers.marketing[0].logoUrl,
              },
            }));
            setFlights(formattedFlights); // Update flights state
            setLoading(false); // Stop loading
            setOngoing(false); // Mark ongoing as false
          }
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading on error
        setOngoing(false); // Mark ongoing as false
        console.error('Error fetching flights data:', error); // Log errors
      });
  };

  // Updates start date state
  const handleStartDateChange = (newValue) => {
    const formattedDate = formatDate(newValue.$d);
    setStartDate(formattedDate);
  };

  // Updates end date state
  const handleEndDateChange = (newValue) => {
    const formattedDate = formatDate(newValue.$d);
    setEndDate(formattedDate);
  };

  // Updates flight type based on user selection
  const handleChange = (event) => {
    setFlightType(event.target.value);
  };

  // Updates cabin class based on user selection
  const handleCabinClass = (event) => {
    setCabinClass(event.target.value);
  };

  // State for managing passenger counts
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // Retrieves specific passenger count
  const getPassengersCount = (value) => {
    switch (value) {
      case "adults":
        return passengers.adults;
      case "children":
        return passengers.children;
      case "infants":
        return passengers.infants;
    }
  };

  // Updates passenger counts based on user input
  const handlePassengerChange = (type, delta) => {
    setPassengers((prevState) => {
      if (delta === -1 && prevState.adults === 1 && type === "adults") {
        return prevState; // Prevent reducing adult count below 1
      }
      return {
        ...prevState,
        [type]: Math.max(prevState[type] + delta, 0), // Ensure count is not negative
      };
    });
  };

  // Calculates total number of passengers
  const getTotal = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  // Passenger type labels
  const passengerTypes = {
    'adults': 'Adults',
    'children': '2-12 years',
    'infants': 'Infants'
  };

  // Flight type options
  const flightTypes = {
    'round-trip': 'Round Trip',
    'one-way': 'One Way',
  };

  // Titles for passenger types
  const passengerTypeTitles = Object.keys(passengerTypes);

  return (
    <>
      {/* Main Container for Search Bar */}
      <Grid container sx={{
        display: 'flex',
        flexDirection: { xs: 'column' },
        bgcolor: 'background.paper',
        position: 'relative'
      }}>
        {/* Search Controls */}
        <Grid container sx={{
          display: 'flex',
          flexDirection: { xs: 'column' },
          boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
          padding: '10px 10px 60px 10px',
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}>
          {/* Flight Type and Passenger Controls */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'row' },
            alignItems: 'center',
            alignSelf: { xs: 'center', sm: 'center', md: 'flex-start' },
          }}>
            {/* Flight Type Selector */}
            <FormControl variant="filled">
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={flightType}
                onChange={handleChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SyncAltIcon sx={{ marginRight: 0.5 }} />
                    {flightTypes[selected]}
                  </Box>
                )}
                sx={{
                  minWidth: 120,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  '& .MuiSelect-select': {
                    padding: '10px 20px',
                  },
                  '&:focus': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <MenuItem value={'round-trip'}>{flightTypes['round-trip']}</MenuItem>
                <MenuItem value={'one-way'}>{flightTypes['one-way']}</MenuItem>
              </Select>
            </FormControl>

            {/* Passenger Count Selector */}
            <FormControl variant="filled" sx={{ m: 1 }}>
              <div>
                <Button
                  id="basic-button"
                  onClick={handleClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                    bgcolor: 'transparent',
                    padding: '10px 0',
                    borderRadius: '0px',
                    borderBottom: openMenu ? '2px solid' : 'none',
                    borderColor: openMenu ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                  startIcon={<PersonOutlineIcon />}
                >
                  <Typography variant="body1">
                    {passengers.adults + passengers.children + passengers.infants}
                  </Typography>
                </Button>
                {/* Passenger Menu */}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                  sx={{
                    width: '300px',
                    mt: 1,
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {/* Passenger Type Adjustments */}
                  {passengerTypeTitles.map((type) => (
                    <MenuItem key={type} sx={{
                      pointerEvents: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography>{passengerTypes[type]}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton sx={{
                    pointerEvents: 'auto',
                  }} onMouseDown={(e) => e.stopPropagation()} onClick={() => handlePassengerChange(type, -1)} 
                          disabled={getPassengersCount(type) === 0}>
                            <RemoveIcon />
                          </IconButton>
                          <Typography>{getPassengersCount(type)}</Typography>
                          <IconButton sx={{
                    pointerEvents: 'auto',
                  }} onMouseDown={(e) => e.stopPropagation()} onClick={() => handlePassengerChange(type, 1)}>
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                  {/* Confirmation Buttons */}
                  <MenuItem sx={{
                    pointerEvents: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}>
                    <Box sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'flex-end',
                      gap: 1,
                    }}>
                      <Button sx={{
                    pointerEvents: 'auto',
                  }} variant="outlined" color="primary" onClick={handleClose} onMouseDown={(e) => e.stopPropagation()}>
                        OK
                      </Button>
                      <Button sx={{
                    pointerEvents: 'auto',
                  }} variant="outlined" color="primary" onClick={handleCancel} onMouseDown={(e) => e.stopPropagation()}>
                        Cancel
                      </Button>
                    </Box>
                  </MenuItem>
                </Menu>
              </div>
            </FormControl>

            {/* Cabin Class Selector */}
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={cabinClass}
                onChange={handleCabinClass}
                sx={{
                  minWidth: 120,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  '& .MuiSelect-select': {
                    padding: '10px 20px',
                  },
                  '&:focus': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <MenuItem value={'economy'}>Economy</MenuItem>
                <MenuItem value={'premium_economy'}>Premium Economy</MenuItem>
                <MenuItem value={'business'}>Business</MenuItem>
                <MenuItem value={'first'}>First</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Airport Selection and Date Pickers */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            flex: 1
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              alignItems: 'center',
              gap: 2,
              width: '100%'
            }}>
              {/* Starting Airport Autocomplete */}
              <Autocomplete
                id="airport-autocomplete-start"
                options={startAirportOptions}
                getOptionLabel={(option) => option?.label || ''}
                onInputChange={handleStartAirportSearchInputChange}
                onChange={getStartAirportOptions}
                loading={startLoading}
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Where do you start from?"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <TripOriginIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton disabled={!Boolean(inputValue)} onClick={handleSearchStart} sx={{ height: '100%' }}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    display: 'none',
                  },
                  flex: 1
                }}
              />
              {/* Destination Airport Autocomplete */}
              <Autocomplete
                id="airport-autocomplete-end"
                options={endAirportOptions}
                getOptionLabel={(option) => option?.label || ''}
                onInputChange={handleEndAirportSearchInputChange}
                onChange={getEndAirportOptions}
                loading={endLoading}
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Where're you going?"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton disabled={!Boolean(inputValue)} onClick={handleSearchEnd} sx={{ height: '100%', justifyContent: 'right' }}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    display: 'none',
                  },
                  flex: 1
                }}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              alignItems: 'center',
              gap: 2,
              width: '100%'
            }}>
              {/* Departure Date Picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Departure"
                  onChange={handleStartDateChange}
                  sx={{ flex: 1 }}
                />
              </LocalizationProvider>
              {/* Return Date Picker (if applicable) */}
              {flightType === 'round-trip' && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Return"
                    onChange={handleEndDateChange}
                    sx={{ flex: 1 }}
                  />
                </LocalizationProvider>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Search Button */}
        <Box sx={{
          display: 'flex',
          position: 'relative',
          bottom: '40px',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            color={!ongoing ? "primary" : "info"}
            startIcon={!ongoing && <SearchIcon />}
            size="large"
            sx={{
              borderRadius: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
              boxShadow: '0 4px 4px rgba(0, 0, 0, 0.2)',
              pointerEvents: !Boolean(startAirportDetails.skyId && endAirportDetails.skyId && startDate  && cabinClass && passengers.adults > 0) || ongoing ? 'none' : 'auto',
              backgroundColor: !Boolean(startAirportDetails.skyId && endAirportDetails.skyId && startDate  && cabinClass && passengers.adults > 0) || ongoing ? '#74bee6' : 'primary'
            }}
            onClick={searchFlights}
          >
            {ongoing ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </Grid>

      {/* Flight Results Display */}
      <Box sx={{ marginTop: '30px' }}>
        {flights && flights.length > 0 ? (
          <>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'left',
                  fontWeight: 'regular',
                  marginBottom: '10px'
                }}
              >
                {`${flights.length}` + (flights.length === 1 ? ' itinerary' : ' itineraries')}
              </Typography>
            </Box>
            <FlightList data={flights} />
          </>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default SearchBar;