import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useGlobalContext } from "contexts/GlobalContext";

const NavBar: FC = () => {
  const { requestedRound, showChart, setShowChart, gProposal, gVersion } = useGlobalContext();
  const apilink: string = "https://v2.beetswars.live/api/v1/bribedata/" + requestedRound
  const plink: string =
    "https://snapshot.org/#/beets.eth/" +
    (showChart ? "" : "proposal/" + gProposal);

  //  console.log(showChart, gProposal, gVersion);

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
          paddingRight: "10px"
        }}
      >
        <Typography variant="caption" align="right">
          <Link
            style={{ fontSize: "1rem" }}
            href="https://beets.fi/#/"
            target="_blank"
            color="white"
            underline="hover"
          >
            beethoven-x
          </Link>{" "}
          |&nbsp;
          <Link
            style={{ fontSize: "1rem" }}
            href={plink}
            target="_blank"
            color="white"
            underline="hover"
          >
            snapshot
          </Link>{" "}
          |&nbsp;
          <Link
            style={{ fontSize: "1rem" }}
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
                style={{ fontSize: "1rem" }}
                // href="https://github.com/mobiusTripper-crypto/beetswars-data"
                href={apilink}
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
          marginTop: "2px",
          padding: "2px",
          display: "flex",
          justifyContent: "flex-end",
          color: "white",
          textDecoration: "none",
        }}
      >
        <div style={{ marginRight: "9px" }}>
          <button onClick={() => setShowChart(!showChart)}>
            {showChart ? "Dashboard ("+gVersion+")" : "Stats"}
          </button>
        </div>
      </Box>
    </>
  );
};
export default NavBar;
