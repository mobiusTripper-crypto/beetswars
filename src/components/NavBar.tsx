import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useGlobalContext } from "contexts/GlobalContext";

type Props = { 
   version: string, 
   proposal: string 
};

const NavBar: FC<Props> = ({ version, proposal }) => {

  const {gBribeFile,  showChart } = useGlobalContext()
  const plink: string = "https://snapshot.org/#/beets.eth/" + (showChart ? "" : "proposal/"+proposal)

  return (
   <Box sx={{ marginBottom: "12px", padding: "2px", 
     display: "flex", justifyContent: "flex-end", 
     background: "black", color: "white", 
     textDecoration: "none" }}>
     <Typography variant="caption" align="right">
       <Link 
          style={{ fontSize: "0.85rem"}} 
          href="https://beets.fi/#/" 
          target="_blank" 
          color="white" 
          underline="hover">
          beethoven-x
       </Link> |&nbsp; 
       <Link 
          style={{ fontSize: "0.85rem"}} 
          href={plink } 
          target="_blank" 
          color="white" 
          underline="hover">
          snapshot
       </Link> |&nbsp; 
       <Link 
          style={{ fontSize: "0.85rem"}} 
          href="https://github.com/mobiusTripper-crypto/beetswars" 
          target="_blank"
          color="white" 
          underline="hover">
          github
       </Link>
{!showChart &&
<> |&nbsp; 
       <Link 
          style={{ fontSize: "0.85rem"}} 
          href="https://github.com/mobiusTripper-crypto/beetswars-data" 
          target="_blank"
          color="white" 
          underline="hover">
          data: {version}
       </Link>
</>
}
     </Typography>
   </Box>
  );
};
export default NavBar;
