import React, { FC, useEffect, useState } from "react";
import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";

const CustomAction: FC<{ action: TimelineAction; row: TimelineRow }> = ({
  action,
  row,
}) => {
  const [clicked, setClicked] = useState(false);
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    // check for clicked property
    if (action && action.events && action.events.clicked) {
      setClicked(true);
    } else {
      setClicked(false);
    }
    // check for selected property
    // if (action && action.events && action.events.selected) {
    //   setSelected(true);
    // } else {
    //   setSelected(false);
    // }
  }, [action]);
  return (
    <div
      style={{
        backgroundColor:
          clicked || selected ? "#6e6ed6" : action["properties"]["bgColor"],
        height: "100%",
        width: "100%",
        opacity: 0.9,
      }}
    >
      <div
        style={{
          textAlign: "center",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          color: "white",
          padding: "7px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >{`Duration: ${(action.end - action.start).toFixed(2)}s`}</div>
    </div>
  );
};

export default CustomAction;
