import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ColorPicker from "react-pick-color";
import { SVG } from "@svgdotjs/svg.js";
import useStore from "./store";

export default function InitialProperties({
  properties,
  setProperties,
  selector,
  selected,
}) {
  const [selectedElProperties, setSelectedElProperties] = useState(null);
  const { setTimer } = useStore();
  useEffect(() => {
    if (selector && properties[selector]) {
      setSelectedElProperties(properties[selector]);
    }
  }, [properties, selector]);
  const handleChange = (e, k) => {
    const value = e.target.value;
    const key = k;
    // set svg attr and change init properties
    let newProperties = { ...properties };
    for (const el_selector of selected) {
      const elProperty = { ...newProperties[el_selector], [key]: value };
      newProperties = { ...newProperties, [el_selector]: elProperty };
      const svgEl = SVG(el_selector);
      svgEl.attr({ [key]: value });
    }
    console.log(newProperties);
    setProperties(newProperties);
    // set timer to 0
    setTimer(0);
  };
  return (
    <div>
      {selectedElProperties !== null &&
        Object.keys(selectedElProperties).map((key, index) => (
          <div key={index}>
            {key === "opacity" ? (
              <div className="initial-properties-input-box">
                <Typography gutterBottom>{key}</Typography>
                <Slider
                  id={key}
                  aria-label={key}
                  value={selectedElProperties[key]}
                  valueLabelDisplay="auto"
                  step={0.1}
                  marks
                  min={0}
                  max={1}
                  onChange={(e) => handleChange(e, key)}
                />
              </div>
            ) : key === "fill" ? (
              <div className="initial-properties-input-box">
                <Typography gutterBottom>{key}</Typography>
                <ColorPicker
                  color={selectedElProperties[key]}
                  theme={{
                    width: "150px",
                  }}
                />
              </div>
            ) : (
              <div className="initial-properties-input-box">
                <Typography gutterBottom>{key}</Typography>
                <TextField
                  id={key}
                  label={key}
                  variant="outlined"
                  value={selectedElProperties[key]}
                  type="number"
                  onChange={(e) => handleChange(e, key)}
                />
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default InitialProperties;
