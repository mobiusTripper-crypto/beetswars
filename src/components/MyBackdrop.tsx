import React from "react"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function MyBackdrop() {
  return (
    <Backdrop className='root' open={true} >
      <CircularProgress size={50} thickness={5} disableShrink sx={{ color: "#4BE39C" }} />
    </Backdrop>
  )
}
