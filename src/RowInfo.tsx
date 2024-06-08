import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { convertTypeToDisplayName } from "./utils";
import ShapeIcon from "./ShapeIcon";
import { SVG } from "@svgdotjs/svg.js";
export default function RowInfo({ item }) {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const { prop, selector } = item;
    if (prop && selector) {
      const el = SVG(selector);
      if (el) {
        setInfo({ type: el["type"], prop });
      }
    }
  }, [item]);
  return (
    <Box sx={{ width: "100%" }}>
      {info ? (
        <Box sx={{ display: "flex", justifyContent: "unset" }}>
          <ShapeIcon svgElType={info["type"]} />
          <Typography sx={{ marginLeft: "20px" }}>
            {convertTypeToDisplayName(info["type"])}
          </Typography>
          <Chip
            label={info["prop"]}
            sx={{ color: "white" }}
            variant="outlined"
          />
        </Box>
      ) : null}
    </Box>
  );
}
