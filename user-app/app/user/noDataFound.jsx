import React from 'react';
import { Typography, Box } from '@mui/material';
import { SearchOff } from '@mui/icons-material';

const NoDataFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      textAlign="center"
    >
      <SearchOff sx={{ fontSize: 60, color: 'grey.500' }} />
      <Typography variant="h6" color="text.secondary" mt={2}>
        No Data Found
      </Typography>
    </Box>
  );
};

export default NoDataFound;
