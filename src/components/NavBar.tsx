import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

type Props = { 
   version: string, 
   proposal: string 
};

const NavBar: FC<Props> = ({ version, proposal }) => {

  var plink: string = "https://snapshot.org/#/beets.eth/proposal/" + proposal

  return (
   <Box sx={{ display: "flex", justifyContent: "right", background: "black", color: "white", textDecoration: "none" }}>
     <Typography variant="caption" align="right">

       <Link href="https://beets.fi/#/" 
          color="white" underline="hover">beethoven-x</Link> |&nbsp; 

       <Link href={plink}
          color="white" underline="hover">snapshot</Link> |&nbsp; 

       <Link href="https://github.com/mobiusTripper-crypto/beetswars" 
          color="white" underline="hover">github</Link> |&nbsp; 

       <Link href="https://github.com/mobiusTripper-crypto/beetswars-data" 
          color="white" underline="hover">data:</Link> {version}

     </Typography>
   </Box>
  );
};
export default NavBar;
