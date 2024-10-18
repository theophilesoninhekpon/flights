import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const Banner = () => {

    return (
        <>
            <Box
                sx={{
                    backgroundImage: 'url("./flights_nc_4.svg")',
                    backgroundSize: 'contain', 
                    backgroundPosition: 'top center', 
                    backgroundRepeat: 'no-repeat',
                    height: '23.92578125vw;', 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
            </Box>
            <Box>
                <Typography
                    variant="h2"
                    sx={{
                        marginTop: { lg: '-120px', sm: '-70px', xs: '-50px' },
                        textAlign: 'center', 
                        fontWeight: 'regular',
                        fontSize: { xs: '2rem', lg: '4rem' }, 
                    }}
                >
                    Flights
                </Typography>
            </Box>
        </>
    );
};

export default Banner;