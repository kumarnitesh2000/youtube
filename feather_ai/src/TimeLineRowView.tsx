import React, { useState, useEffect } from "react";
import { getSelector, selectColorCode } from "./utils";
import { SVG } from "@svgdotjs/svg.js";
import RowInfo from "./RowInfo";

const TimeLineRowView = ({ data, currentEl, setCurrentEl }) => {
  const [currentElSelector, setCurrentElSelector] = useState(null);
  useEffect(() => {
    setCurrentElSelector(getSelector(currentEl));
  }, [currentEl]);
  const handleRowClick = (item) => {
    setCurrentEl(SVG(item.selector));
  };
  return (
    <div>
      {data.map((item) => (
        <div
          className="timeline-list-item"
          onClick={() => handleRowClick(item)}
          key={item.id}
          style={{
            cursor: "pointer",
            backgroundColor: selectColorCode(item.selector),
            color: "white",
          }}
        >
          <RowInfo item={item} />
        </div>
      ))}
    </div>
  );
};

export default TimeLineRowView;
