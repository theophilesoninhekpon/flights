import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, CardMedia } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimelapseIcon from '@mui/icons-material/Timelapse';

const FlightCard = ({ flight }) => {
    return (
        <Card>
            {/* Destionation picture */}
            <CardMedia
                component="img"
                height="140"
                image={flight.destinationImageUrl}
                alt={`Image de ${flight.to}`}
            />
            {/* Destionation initerary informations: price, duration... */}
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    {/* Informations de la destination et du prix */}
                    <Typography variant="h6">{`${flight.from} ➔ ${flight.to}`}</Typography>
                    <Typography variant="h6" color="primary">{`${flight.price}`}</Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <Box display='flex' alignItems="center">
                        <CalendarTodayIcon fontSize="inherit" sx={{ fontSize: '1rem' }} /> 
                        <Typography variant="body2" sx={{ marginLeft: 1 }}>{`${flight.departureTime} — ${flight.arrivalTime}`}</Typography>
                    </Box>
                    <Box display='flex' alignItems="center">
                        <TimelapseIcon fontSize="inherit" sx={{ fontSize: '1rem' }} /> 
                        <Typography variant="body2" sx={{ marginLeft: 1 }}>{`${flight.duration}`}</Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" mt={2}>
                    <Avatar src={flight.carrier.logo} alt={flight.carrier.name} style={{ marginRight: 10 }} />
                    <Typography variant="body2">{flight.carrier.name}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FlightCard;