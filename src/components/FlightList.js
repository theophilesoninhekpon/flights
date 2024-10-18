import React , {useEffect} from 'react';
import FlightCard from './FlightCard';
import Grid from '@mui/material/Grid2';

const FlightList = ({data = []}) => {
      
    // Itineraries list
      return (
    <Grid container spacing={2} marginBottom={5}>
      {data.length > 0 ? data.map(flight => (
        <Grid item xs={12} sm={6} md={4} key={flight.id}>
          <FlightCard flight={flight} />
        </Grid>
      )) : ''}
    </Grid>
  );
};

export default FlightList;