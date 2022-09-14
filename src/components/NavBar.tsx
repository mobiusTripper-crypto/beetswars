import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useGlobalContext } from "contexts/GlobalContext";

const NavBar: FC = () => {
  const { gBribeFile, showChart, setShowChart, gProposal, gVersion } = useGlobalContext();
  const plink: string =
    "https://snapshot.org/#/beets.eth/" +
    (showChart ? "" : "proposal/" + gProposal);

  console.log(gBribeFile, showChart, gProposal, gVersion);

  return (
<>
    <Box
      sx={{
        padding: "2px",
        display: "flex",
        justifyContent: "flex-end",
        background: "black",
        color: "white",
        textDecoration: "none",
      }}
    >

      <Typography variant="caption" align="right">
        <Link
          style={{ fontSize: "0.9rem" }}
          href="https://beets.fi/#/"
          target="_blank"
          color="white"
          underline="hover"
        >
          beethoven-x
        </Link>{" "}
        |&nbsp;
        <Link
          style={{ fontSize: "0.9rem" }}
          href={plink}
          target="_blank"
          color="white"
          underline="hover"
        >
          snapshot
        </Link>{" "}
        |&nbsp;
        <Link
          style={{ fontSize: "0.9rem" }}
          href="https://github.com/mobiusTripper-crypto/beetswars"
          target="_blank"
          color="white"
          underline="hover"
        >
          github
        </Link>
        {!showChart && (
          <>
            {" "}
            |&nbsp;
            <Link
              style={{ fontSize: "0.9rem" }}
              href="https://github.com/mobiusTripper-crypto/beetswars-data"
              target="_blank"
              color="white"
              underline="hover"
            >
              data: {gVersion}
            </Link>
          </>
        )}
      </Typography>
    </Box>
    <Box
      sx={{
        marginTop: "4px",
        padding: "2px",
        display: "flex",
        justifyContent: "flex-end",
        color: "white",
        textDecoration: "none",
      }}
    >
      <button onClick={() => setShowChart(!showChart)}>
        {showChart ? ("Dashboard"):("Stats")}
      </button>
    </Box>
</>
  );
};
export default NavBar;
