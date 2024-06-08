import React from "react";
import RectangleIcon from "@mui/icons-material/Rectangle";
import CircleIcon from "@mui/icons-material/Circle";
import RouteIcon from "@mui/icons-material/Route";
import ImageIcon from "@mui/icons-material/Image";
import AbcIcon from "@mui/icons-material/Abc";
import FolderIcon from "@mui/icons-material/Folder";

const ShapeIcon = ({ svgElType }) => {
  if (svgElType === "rect") {
    return <RectangleIcon />;
  }
  if (svgElType === "circle" || svgElType === "ellipse") {
    return <CircleIcon />;
  }
  if (svgElType === "path") {
    return <RouteIcon />;
  }
  if (svgElType === "image") {
    return <ImageIcon />;
  }
  if (svgElType === "text") {
    return <AbcIcon />;
  }
  if (svgElType === "g") {
    return <FolderIcon />;
  }
  return null;
};

export default ShapeIcon;
