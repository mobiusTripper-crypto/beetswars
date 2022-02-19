import React, { FC } from "react";
import { Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";

type Props = { label: string; value: string };

const LabledListItem: FC<Props> = ({ label, value }) => {
  return (
    <ListItem>
      <div>
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ fontWeight: "700", ml: 1 }}
        >
          {value}
        </Typography>
      </div>
    </ListItem>
  );
};
export default LabledListItem;
